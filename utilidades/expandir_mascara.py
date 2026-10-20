#!/usr/bin/env python3
"""Expande las aperturas de un Gerber de máscara de soldadura (KiCad) en E mm por lado.
Equivale a poner 'Expansión de máscara' = E en KiCad. Solo trabaja sobre aperturas (flashes)."""
import re, sys
from shapely.geometry import Polygon

def fmt(v): return f"{v:.6f}"

def patch_freepoly(body, e):
    prims = body.replace('\n','').split('*')
    out=[]
    for p in prims:
        if not p: continue
        if p.startswith('4,1,'):
            f=p.split(',')
            n=int(f[2]); coords=list(map(float,f[3:3+2*(n+1)])); rot=f[3+2*(n+1)]
            pts=list(zip(coords[0::2],coords[1::2]))
            poly=Polygon(pts)
            if not poly.is_valid: poly=poly.buffer(0)
            b=poly.buffer(e, resolution=16, join_style=1).simplify(0.0005)
            ring=list(b.exterior.coords)
            flat=','.join(f"{fmt(x)},{fmt(y)}" for x,y in ring)
            out.append(f"4,1,{len(ring)-1},{flat},{rot}")
        else:
            out.append(p)
    return '*\n'.join(out)+'*'

def patch(text, e, comment):
    # macros FreePoly: se expanden con buffer; el resto se parametriza en la definición ADD
    text = re.sub(r'%AM(\w+)\*\n(.*?)\*%',
                  lambda m: (f"%AM{m.group(1)}*\n{patch_freepoly(m.group(2), e)}%" if m.group(1).startswith('FreePoly') else m.group(0)),
                  text, flags=re.S)
    def ad(m):
        num, kind, params = m.group(1), m.group(2), m.group(3)
        v=params.split('X')
        if kind=='C': v=[float(v[0])+2*e]+v[1:]
        elif kind in ('R','O'): v=[float(v[0])+2*e, float(v[1])+2*e]+v[2:]
        elif kind=='RoundRect': v=[float(v[0])+e]+v[1:]
        elif kind=='RotRect': v=[float(v[0])+2*e, float(v[1])+2*e]+v[2:]
        elif kind.startswith('FreePoly'): return m.group(0)
        else: raise SystemExit(f'apertura desconocida: {m.group(0)}')
        v=[x if isinstance(x,str) else fmt(x) for x in v]
        return f"%ADD{num}{kind},{'X'.join(v)}*%"
    # separa nombre de macro y parámetros: nombre alfabético seguido de coma
    text = re.sub(r'%ADD(\d+)([A-Za-z]+\d*),([^*]*)\*%', lambda m: ad(m), text)
    text = text.replace('G04 APERTURE LIST*', f'G04 {comment}*\nG04 APERTURE LIST*',1)
    return text

if __name__=='__main__':
    e=float(sys.argv[1])
    for f in sys.argv[2:]:
        raw=open(f,'rb').read().decode('utf8'); crlf='\r\n' in raw
        out=patch(raw.replace('\r\n','\n'),e,f'Mascara expandida {e} mm por lado (script expandir_mascara.py)')
        open(f,'wb').write((out.replace('\n','\r\n') if crlf else out).encode('utf8'))
