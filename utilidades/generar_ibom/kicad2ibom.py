#!/usr/bin/env python3
"""Conversor .kicad_pcb (KiCad 10) -> pcbdata de InteractiveHtmlBom (formato v2.11).

No necesita KiCad: lee el archivo con un parser de s-expressions y genera los datos
(bordes, serigrafia, pads, pistas, zonas, BOM). El texto se dibuja con trazos
(fuente Hershey 'futural') y se entrega como svgpath, igual que hace iBOM.
"""
import math, re, json, unicodedata
from HersheyFonts import HersheyFonts
from shapely.geometry import Polygon, Point, LineString, box
from shapely.ops import unary_union

# ---------------------------------------------------------------- s-expr
def parse(src):
    toks = re.findall(r'\(|\)|"(?:[^"\\]|\\.)*"|[^\s()"]+', src)
    pos = 0
    def rd():
        nonlocal pos
        t = toks[pos]; pos += 1
        if t == '(':
            out = []
            while toks[pos] != ')':
                out.append(rd())
            pos += 1
            return out
        if t[0] == '"':
            return S(t[1:-1].replace('\\"', '"').replace('\\\\', '\\'))
        return t
    return rd()

class S(str):
    """cadena entre comillas"""

def kids(n, name):
    return [c for c in n if isinstance(c, list) and c and c[0] == name]

def kid(n, name):
    for c in n:
        if isinstance(c, list) and c and c[0] == name:
            return c
    return None

def num(x):
    return float(x)

def xy(n):
    return (num(n[1]), num(n[2]))

# ---------------------------------------------------------------- geometria
def rot_pt(p, ang):
    """rotacion KiCad (positivo = antihorario en pantalla, eje y hacia abajo)"""
    a = math.radians(ang)
    c, s = math.cos(a), math.sin(a)
    return (p[0] * c + p[1] * s, -p[0] * s + p[1] * c)

class Tf:
    def __init__(self, x=0.0, y=0.0, ang=0.0):
        self.x, self.y, self.ang = x, y, ang
    def __call__(self, p):
        q = rot_pt(p, self.ang)
        return (self.x + q[0], self.y + q[1])

def circle3(p1, p2, p3):
    ax, ay = p1; bx, by = p2; cx, cy = p3
    d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
    if abs(d) < 1e-12:
        return None
    ux = ((ax**2 + ay**2) * (by - cy) + (bx**2 + by**2) * (cy - ay) + (cx**2 + cy**2) * (ay - by)) / d
    uy = ((ax**2 + ay**2) * (cx - bx) + (bx**2 + by**2) * (ax - cx) + (cx**2 + cy**2) * (bx - ax)) / d
    return (ux, uy), math.hypot(ax - ux, ay - uy)

def arc_angles(c, p1, pm, p2):
    a1 = math.degrees(math.atan2(p1[1] - c[1], p1[0] - c[0]))
    am = math.degrees(math.atan2(pm[1] - c[1], pm[0] - c[0]))
    a2 = math.degrees(math.atan2(p2[1] - c[1], p2[0] - c[0]))
    dm = (am - a1) % 360
    d2 = (a2 - a1) % 360
    if dm <= d2:      # p1 -> pm -> p2 con angulo creciente (horario en pantalla)
        return a1, a1 + d2
    # sentido contrario: se recorre de p2 a p1
    return a2, a2 + (360 - d2) % 360 if (360 - d2) % 360 else a2 + 360

def arc_points(c, r, a1, a2, step=4.0):
    n = max(2, int(abs(a2 - a1) / step) + 1)
    return [(c[0] + r * math.cos(math.radians(a1 + (a2 - a1) * i / n)),
             c[1] + r * math.sin(math.radians(a1 + (a2 - a1) * i / n))) for i in range(n + 1)]

def r6(v):
    return round(v, 6)

def pt(p):
    return [r6(p[0]), r6(p[1])]

def svg_poly(pts, close=True):
    s = 'M' + 'L'.join('%s,%s' % (r6(x), r6(y)) for x, y in pts)
    return s + ('Z' if close else '')

# ---------------------------------------------------------------- texto
_font = HersheyFonts()
_font.load_default_font('futural')
GL = {}
for ch, g in _font.all_glyphs.items():
    st = g._HersheyGlyph__strokes
    l, r = g._HersheyGlyph__left_side, g._HersheyGlyph__right_side
    base = g._HersheyGlyph__baseline
    lines = [[((x - l) / 21.0, (y - base) / 21.0 - 0.05) for x, y in s] for s in st]
    GL[ch] = ((r - l) / 21.0, lines)

def glyph(c):
    if c in GL:
        return GL[c]
    d = unicodedata.normalize('NFD', c)[0]
    return GL.get(d, GL['?'] if '?' in GL else GL[' '])

def text_svgpath(txt, pos, angle, h, w, thick, hj, vj, mirrored, italic=False):
    """Devuelve el svgpath (coordenadas de tablero) de un texto con la logica de drawText de iBOM."""
    lines = txt.split('\n')
    if lines and lines[-1] == '':
        lines.pop()
    if not lines:
        return ''
    tilt = 0.125 if italic else 0.0
    inter = (h * 1.5 + thick) / 2.0
    th = angle if mirrored else -angle
    a = math.radians(th)
    ca, sa = math.cos(a), math.sin(a)
    segs = []
    vshift = {'top': h / 2.0 * len(lines), 'bottom': -h / 2.0 * len(lines)}.get(vj, 0.0) if vj else 0.0
    for i, line in enumerate(lines):
        oy = (-(len(lines) - 1) + i * 2) * inter + h / 2.0 + (vshift if vj else 0)
        lw = thick + inter * tilt
        for ch in line:
            lw += glyph(ch)[0] * w
        ox = {-1: 0.0, 0: -lw / 2.0, 1: -lw}[hj]
        for ch in line:
            gw, strokes = glyph(ch)
            for s in strokes:
                seg = []
                for (px, py) in s:
                    X = px * w + ox - (py + 0.5 * (1 + hj)) * h * tilt
                    Y = py * h + oy
                    X += thick * 0.5
                    rx, ry = X * ca - Y * sa, X * sa + Y * ca
                    if mirrored:
                        rx = -rx
                    seg.append((pos[0] + rx, pos[1] + ry))
                segs.append(seg)
            ox += gw * w
    out = []
    for sg in segs:
        if len(sg) == 1:
            sg = [sg[0], (sg[0][0] + 0.001, sg[0][1])]
        out.append(svg_poly(sg, close=False))
    return ''.join(out)

def parse_effects(n):
    eff = kid(n, 'effects')
    h = w = 1.0; thick = 0.15; hj = 0; vj = None; mir = False; ital = False; hide = False
    if eff:
        f = kid(eff, 'font')
        if f:
            sz = kid(f, 'size')
            if sz:
                h, w = num(sz[1]), num(sz[2])
            t = kid(f, 'thickness')
            if t:
                thick = num(t[1])
            if 'italic' in [x for x in f if isinstance(x, str)]:
                ital = True
        j = kid(eff, 'justify')
        if j:
            for tok in j[1:]:
                if tok == 'left': hj = -1
                elif tok == 'right': hj = 1
                elif tok in ('top', 'bottom'): vj = tok
                elif tok == 'mirror': mir = True
        if 'hide' in [x for x in eff if isinstance(x, str)]:
            hide = True
        hd = kid(eff, 'hide')
        if hd and len(hd) > 1 and hd[1] == 'yes':
            hide = True
    return dict(h=h, w=w, thick=thick, hj=hj, vj=vj, mirror=mir, italic=ital, hide=hide)

# ---------------------------------------------------------------- conversor
LAYMAP = {'F.SilkS': ('silkscreen', 'F'), 'B.SilkS': ('silkscreen', 'B'),
          'F.Silkscreen': ('silkscreen', 'F'), 'B.Silkscreen': ('silkscreen', 'B'),
          'F.Fab': ('fabrication', 'F'), 'B.Fab': ('fabrication', 'B')}

def yes(n, name):
    k = kid(n, name)
    if k is None:
        return False
    return len(k) < 2 or k[1] in ('yes', 'true')

def stroke_w(n):
    s = kid(n, 'stroke')
    if s:
        w = kid(s, 'width')
        if w:
            return num(w[1])
    w = kid(n, 'width')
    return num(w[1]) if w else 0.1

def fill_of(n):
    f = kid(n, 'fill')
    if f is None:
        return False
    if len(f) > 1 and isinstance(f[1], str):
        return f[1] in ('yes', 'solid', 'true')
    t = kid(f, 'type')
    return bool(t and t[1] not in ('none',))

def layer_of(n):
    l = kid(n, 'layer')
    return str(l[1]) if l else ''

def graphic(n, tf):
    """Convierte gr_/fp_ line,arc,circle,rect,poly a dict(s) iBOM (coordenadas absolutas)."""
    kind = n[0].split('_', 1)[1]
    w = stroke_w(n)
    out = []
    if kind == 'line':
        out.append(dict(type='segment', start=pt(tf(xy(kid(n, 'start')))), end=pt(tf(xy(kid(n, 'end')))), width=r6(w)))
    elif kind == 'arc':
        p1, pm, p2 = tf(xy(kid(n, 'start'))), tf(xy(kid(n, 'mid'))), tf(xy(kid(n, 'end')))
        cr = circle3(p1, pm, p2)
        if cr is None:
            out.append(dict(type='segment', start=pt(p1), end=pt(p2), width=r6(w)))
        else:
            c, r = cr
            a1, a2 = arc_angles(c, p1, pm, p2)
            out.append(dict(type='arc', start=pt(c), radius=r6(r), startangle=r6(a1), endangle=r6(a2), width=r6(w)))
    elif kind == 'circle':
        c = tf(xy(kid(n, 'center'))); e = tf(xy(kid(n, 'end')))
        r = math.hypot(e[0] - c[0], e[1] - c[1])
        if fill_of(n):
            d = 'M%s,%sa%s,%s 0 1,0 %s,0a%s,%s 0 1,0 %s,0Z' % (r6(c[0] - r), r6(c[1]), r6(r), r6(r), r6(2 * r), r6(r), r6(r), r6(-2 * r))
            out.append(dict(type='polygon', svgpath=d, filled=1, width=r6(w)))
        else:
            out.append(dict(type='circle', start=pt(c), radius=r6(r), width=r6(w)))
    elif kind == 'rect':
        a = xy(kid(n, 'start')); b = xy(kid(n, 'end'))
        pts = [tf(a), tf((b[0], a[1])), tf(b), tf((a[0], b[1]))]
        if fill_of(n):
            out.append(dict(type='polygon', svgpath=svg_poly(pts), filled=1, width=r6(w)))
        else:
            for i in range(4):
                out.append(dict(type='segment', start=pt(pts[i]), end=pt(pts[(i + 1) % 4]), width=r6(w)))
    elif kind == 'poly':
        pts = [tf(xy(p)) for p in kids(kid(n, 'pts'), 'xy')]
        d = dict(type='polygon', svgpath=svg_poly(pts), width=r6(w))
        d['filled'] = 1 if fill_of(n) else 0
        out.append(d)
    return out

def board_loops(edges):
    """Une los bordes de Edge.Cuts en lazos cerrados (listas de puntos)."""
    polys = []
    for e in edges:
        if e['type'] == 'segment':
            polys.append([tuple(e['start']), tuple(e['end'])])
        elif e['type'] == 'arc':
            polys.append(arc_points(tuple(e['start']), e['radius'], e['startangle'], e['endangle'], 3.0))
        elif e['type'] == 'circle':
            polys.append(arc_points(tuple(e['start']), e['radius'], 0, 360, 5.0))
    loops = []
    pool = [p[:] for p in polys]
    tol = 0.01
    def close(a, b):
        return math.hypot(a[0] - b[0], a[1] - b[1]) < tol
    while pool:
        cur = pool.pop(0)
        grown = True
        while grown and not close(cur[0], cur[-1]):
            grown = False
            for i, p in enumerate(pool):
                if close(cur[-1], p[0]):
                    cur += p[1:]; pool.pop(i); grown = True; break
                if close(cur[-1], p[-1]):
                    cur += p[::-1][1:]; pool.pop(i); grown = True; break
        loops.append(cur)
    return [l for l in loops if len(l) > 2]

def convert(path, title=None, revision=None, date=None, company=None):
    tree = parse(open(path, encoding='utf8').read())
    tb = kid(tree, 'title_block')
    def tbv(k, d=''):
        x = kid(tb, k) if tb else None
        return str(x[1]) if x else d
    meta = dict(title=title or tbv('title', 'PCB'), revision=revision or tbv('rev', ''),
                company=company if company is not None else tbv('company', ''), date=date or tbv('date', ''), variant='')
    data = dict(edges=[], drawings=dict(silkscreen=dict(F=[], B=[]), fabrication=dict(F=[], B=[])),
                footprints=[], tracks=dict(F=[], B=[]), zones=dict(F=[], B=[]), nets=[], font_data={})
    nets = set()
    ident = Tf()

    # --- graficos de la placa
    for n in tree:
        if not (isinstance(n, list) and n):
            continue
        if n[0] in ('gr_line', 'gr_arc', 'gr_circle', 'gr_rect', 'gr_poly'):
            L = layer_of(n)
            if L == 'Edge.Cuts':
                if n[0] == 'gr_rect':
                    a = xy(kid(n, 'start')); b = xy(kid(n, 'end')); w = stroke_w(n)
                    for p, q in ((a, (b[0], a[1])), ((b[0], a[1]), b), (b, (a[0], b[1])), ((a[0], b[1]), a)):
                        data['edges'].append(dict(type='segment', start=pt(p), end=pt(q), width=r6(w)))
                elif n[0] == 'gr_poly':
                    pts = [xy(p) for p in kids(kid(n, 'pts'), 'xy')]
                    for i in range(len(pts)):
                        data['edges'].append(dict(type='segment', start=pt(pts[i]), end=pt(pts[(i + 1) % len(pts)]), width=r6(stroke_w(n))))
                else:
                    data['edges'] += graphic(n, ident)
            elif L in LAYMAP:
                k, s = LAYMAP[L]
                data['drawings'][k][s] += graphic(n, ident)
        elif n[0] == 'gr_text':
            L = layer_of(n)
            if L in LAYMAP:
                k, s = LAYMAP[L]
                at = kid(n, 'at'); ef = parse_effects(n)
                ang = num(at[3]) if len(at) > 3 else 0.0
                txt = str(n[1]).replace('\\n', '\n')
                if ef['hide']:
                    continue
                path_ = text_svgpath(txt, (num(at[1]), num(at[2])), ang, ef['h'], ef['w'], ef['thick'], ef['hj'], ef['vj'], ef['mirror'] or s == 'B' and False, ef['italic'])
                if path_:
                    data['drawings'][k][s].append(dict(thickness=r6(ef['thick']), svgpath=path_))

    # --- footprints
    fps = kids(tree, 'footprint')
    skipped = []
    bomrows = []
    for idx, fp in enumerate(fps):
        at = kid(fp, 'at')
        fx, fy = num(at[1]), num(at[2]); frot = num(at[3]) if len(at) > 3 else 0.0
        tf = Tf(fx, fy, frot)
        lay = 'B' if layer_of(fp).startswith('B.') else 'F'
        props = {str(p[1]): p for p in kids(fp, 'property')}
        ref = str(props['Reference'][2]) if 'Reference' in props else 'REF'
        val = str(props['Value'][2]) if 'Value' in props else ''
        libname = str(fp[1]).split(':')[-1]
        attrs = kid(fp, 'attr')
        attrs = [str(a) for a in attrs[1:]] if attrs else []
        # pads
        pads = []
        minx = miny = 1e9; maxx = maxy = -1e9
        for pd in kids(fp, 'pad'):
            pat = kid(pd, 'at')
            lx, ly = num(pat[1]), num(pat[2]); pang = num(pat[3]) if len(pat) > 3 else 0.0
            ap = tf((lx, ly))
            ptype = str(pd[2]); shape = str(pd[3])
            sz = kid(pd, 'size'); size = [num(sz[1]), num(sz[2])]
            layers = [str(x) for x in kid(pd, 'layers')[1:]]
            L = []
            if any(x == '*.Cu' for x in layers): L = ['F', 'B']
            else:
                if 'F.Cu' in layers: L.append('F')
                if 'B.Cu' in layers: L.append('B')
            tp = 'smd' if ptype in ('smd', 'connect') else 'th'
            d = dict(pos=pt(ap), size=[r6(size[0]), r6(size[1])], angle=r6(-pang), type=tp)
            dr = kid(pd, 'drill')
            if dr and tp == 'th':
                if len(dr) > 1 and dr[1] == 'oval':
                    d['drillshape'] = 'oblong'; d['drillsize'] = [num(dr[2]), num(dr[3])]
                else:
                    dd = num(dr[1]); d['drillshape'] = 'circle'; d['drillsize'] = [dd, dd]
            elif tp == 'th':
                d['drillshape'] = 'circle'; d['drillsize'] = [0, 0]
            d['offset'] = [0.0, 0.0]
            d['layers'] = L
            if shape in ('circle', 'rect', 'oval'):
                d['shape'] = shape
            elif shape == 'roundrect':
                d['shape'] = 'roundrect'
                rr = kid(pd, 'roundrect_rratio')
                d['radius'] = r6((num(rr[1]) if rr else 0.25) * min(size))
            elif shape == 'trapezoid':
                d['shape'] = 'rect'
            elif shape == 'custom':
                d['shape'] = 'custom'
                geoms = []
                anchor = kid(pd, 'options')
                anch = 'circle'
                if anchor:
                    a = kid(anchor, 'anchor')
                    if a: anch = str(a[1])
                geoms.append(box(-size[0] / 2, -size[1] / 2, size[0] / 2, size[1] / 2) if anch == 'rect' else Point(0, 0).buffer(size[0] / 2, 16))
                prim = kid(pd, 'primitives')
                for g in (prim[1:] if prim else []):
                    if not isinstance(g, list): continue
                    wv = kid(g, 'width'); wv = num(wv[1]) if wv else 0.0
                    if g[0] == 'gr_poly':
                        pp = [xy(p) for p in kids(kid(g, 'pts'), 'xy')]
                        pg = Polygon(pp)
                        geoms.append(pg.buffer(wv / 2, 8) if wv > 0 else pg)
                    elif g[0] == 'gr_circle':
                        c = xy(kid(g, 'center')); e = xy(kid(g, 'end'))
                        geoms.append(Point(c).buffer(math.hypot(e[0] - c[0], e[1] - c[1]) + wv / 2, 16))
                    elif g[0] == 'gr_line':
                        geoms.append(LineString([xy(kid(g, 'start')), xy(kid(g, 'end'))]).buffer(wv / 2, 8))
                    elif g[0] == 'gr_rect':
                        a = xy(kid(g, 'start')); b = xy(kid(g, 'end'))
                        geoms.append(box(min(a[0], b[0]), min(a[1], b[1]), max(a[0], b[0]), max(a[1], b[1])))
                u = unary_union(geoms)
                polys = list(u.geoms) if hasattr(u, 'geoms') else [u]
                d['polygons'] = [[pt(p) for p in list(pl.exterior.coords)[:-1]] for pl in polys]
            else:
                d['shape'] = 'rect'
            nt = kid(pd, 'net')
            if nt and len(nt) > 1 and str(nt[1]):
                d['net'] = str(nt[1]); nets.add(str(nt[1]))
            if str(pd[1]) in ('1', 'A1') and 'pin1' not in d and not any(p.get('pin1') for p in pads):
                d['pin1'] = 1
            pads.append(d)
            hw, hh = size[0] / 2, size[1] / 2
            la = (pang - frot) % 180
            if abs(la - 90) < 1: hw, hh = hh, hw
            minx = min(minx, lx - hw); maxx = max(maxx, lx + hw)
            miny = min(miny, ly - hh); maxy = max(maxy, ly + hh)
        for ln in kids(fp, 'fp_line') + kids(fp, 'fp_rect'):
            if layer_of(ln) in ('F.CrtYd', 'B.CrtYd'):
                for k in ('start', 'end'):
                    p = xy(kid(ln, k)); minx = min(minx, p[0]); maxx = max(maxx, p[0]); miny = min(miny, p[1]); maxy = max(maxy, p[1])
        if minx > maxx:
            minx = miny = -0.5; maxx = maxy = 0.5
        # graficos del footprint
        for n in fp:
            if not (isinstance(n, list) and n):
                continue
            if n[0] in ('fp_line', 'fp_arc', 'fp_circle', 'fp_rect', 'fp_poly'):
                L = layer_of(n)
                if L == 'Edge.Cuts':
                    data['edges'] += graphic(n, tf)
                elif L in LAYMAP:
                    k, s = LAYMAP[L]
                    data['drawings'][k][s] += graphic(n, tf)
            elif n[0] in ('fp_text', 'property') or (n[0] == 'gr_text'):
                pass
        # textos: property Reference/Value + fp_text user
        def add_text(node, kindkey):
            L = layer_of(node)
            if L not in LAYMAP:
                return
            ef = parse_effects(node)
            hide = ef['hide'] or yes(node, 'hide')
            if hide:
                return
            k, s = LAYMAP[L]
            a = kid(node, 'at'); lp = (num(a[1]), num(a[2])); ang = num(a[3]) if len(a) > 3 else 0.0
            ap = tf(lp)
            txt = str(node[2] if node[0] in ('property', 'fp_text') and node[0] == 'property' else node[2]).replace('\\n', '\n')
            txt = txt.replace('${REFERENCE}', ref).replace('${VALUE}', val)
            txt = re.sub(r'\$\{[^}]*\}', '', txt)
            if not txt.strip():
                return
            mir = ef['mirror']
            pth = text_svgpath(txt, ap, ang, ef['h'], ef['w'], ef['thick'], ef['hj'], ef['vj'], mir, ef['italic'])
            if not pth:
                return
            d = dict(thickness=r6(ef['thick']), svgpath=pth)
            if kindkey: d[kindkey] = 1
            data['drawings'][k][s].append(d)
        if 'Reference' in props: add_text(props['Reference'], 'ref')
        if 'Value' in props: add_text(props['Value'], 'val')
        for ft in kids(fp, 'fp_text'):
            if len(ft) > 2 and str(ft[1]) == 'user':
                add_text(ft, None)
        data['footprints'].append(dict(ref=ref, bbox=dict(pos=pt((fx, fy)), relpos=pt((minx, miny)),
                                  size=[r6(maxx - minx), r6(maxy - miny)], angle=r6(frot)),
                                       pads=pads, drawings=[], layer=lay))
        skip = ('exclude_from_bom' in attrs) or ('dnp' in attrs) or ref.startswith('#') or ref.startswith('REF**')
        if skip:
            skipped.append(idx)
        else:
            bomrows.append((idx, ref, val, libname, lay))

    # --- pistas, vias, zonas
    for sg in kids(tree, 'segment'):
        L = layer_of(sg)
        if L not in ('F.Cu', 'B.Cu'): continue
        nt = kid(sg, 'net'); net = str(nt[1]) if nt else ''
        if net: nets.add(net)
        data['tracks'][L[0]].append(dict(start=pt(xy(kid(sg, 'start'))), end=pt(xy(kid(sg, 'end'))), width=r6(num(kid(sg, 'width')[1])), net=net))
    for sg in kids(tree, 'arc'):
        L = layer_of(sg)
        if L not in ('F.Cu', 'B.Cu'): continue
        p1, pm, p2 = xy(kid(sg, 'start')), xy(kid(sg, 'mid')), xy(kid(sg, 'end'))
        cr = circle3(p1, pm, p2)
        nt = kid(sg, 'net'); net = str(nt[1]) if nt else ''
        if net: nets.add(net)
        if cr:
            a1, a2 = arc_angles(cr[0], p1, pm, p2)
            data['tracks'][L[0]].append(dict(center=pt(cr[0]), radius=r6(cr[1]), startangle=r6(a1), endangle=r6(a2), width=r6(num(kid(sg, 'width')[1])), net=net))
    for v in kids(tree, 'via'):
        p = xy(kid(v, 'at')); size = num(kid(v, 'size')[1]); drill = num(kid(v, 'drill')[1])
        nt = kid(v, 'net'); net = str(nt[1]) if nt else ''
        if net: nets.add(net)
        for s in ('F', 'B'):
            data['tracks'][s].append(dict(start=pt(p), end=pt(p), width=r6(size), net=net, drillsize=r6(drill)))
    for z in kids(tree, 'zone'):
        nt = kid(z, 'net'); net = str(nt[1]) if nt else ''
        if net: nets.add(net)
        per = {}
        for fpz in kids(z, 'filled_polygon'):
            L = layer_of(fpz)
            if L not in ('F.Cu', 'B.Cu'): continue
            per.setdefault(L[0], []).append([pt(xy(p)) for p in kids(kid(fpz, 'pts'), 'xy')])
        for s, polys in per.items():
            data['zones'][s].append(dict(polygons=polys, net=net, width=0))

    # --- BOM
    groups = {}
    for idx, ref, val, libname, lay in bomrows:
        groups.setdefault((val, libname), []).append((ref, idx, lay))
    def nat(r):
        return [int(t) if t.isdigit() else t for t in re.split(r'(\d+)', r)]
    def rows(filter_layer=None):
        out = []
        for (val, lib), items in groups.items():
            its = [(r, i) for r, i, l in items if filter_layer is None or l == filter_layer]
            if its:
                its.sort(key=lambda t: nat(t[0]))
                out.append(its)
        out.sort(key=lambda g: nat(g[0][0]))
        return out
    fields = {str(idx): [val, libname] for idx, ref, val, libname, lay in bomrows}
    # fields indexados por posicion (como iBOM): clave = indice de footprint
    data['bom'] = dict(both=[[list(x) for x in g] for g in rows()], skipped=skipped, fields=fields,
                       F=[[list(x) for x in g] for g in rows('F')], B=[[list(x) for x in g] for g in rows('B')])
    data['nets'] = sorted(nets)
    loops = board_loops(data['edges'])
    data['board_path'] = ''.join(svg_poly([pt(p) for p in l]) for l in loops)
    xs = [p[0] for l in loops for p in l]; ys = [p[1] for l in loops for p in l]
    data['edges_bbox'] = dict(minx=min(xs), miny=min(ys), maxx=max(xs), maxy=max(ys))
    data['metadata'] = meta
    data['ibom_version'] = 'v2.11.2'
    return data

if __name__ == '__main__':
    import sys
    d = convert(sys.argv[1])
    json.dump(d, open(sys.argv[2], 'w'))
    print({k: (len(v) if hasattr(v, '__len__') else v) for k, v in d.items()})
