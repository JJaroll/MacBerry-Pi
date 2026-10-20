#!/usr/bin/env python3
"""Genera los iBOM (BOM interactivo) en espanol de las placas del repositorio.

Uso:  python3 utilidades/generar_ibom/generar_ibom.py [J20|J22|DC|MASTER ...]
Requiere:  pip install HersheyFonts shapely
No necesita KiCad ni Node: lee el .kicad_pcb y rellena la plantilla de iBOM del repositorio.
"""
import json, re, sys, html, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import kicad2ibom as k2i
from lzstring import compress_to_base64
H = os.path.abspath(os.path.join(HERE, '..', '..', 'hardware')) + '/'
BOARDS={
 'J20':dict(src=H+'placas_individuales/J20_video/imac_g3_333mhz_slot_loading_J20_adapter_board_es.kicad_pcb',
            out=H+'placas_individuales/J20_video/ibom_es.html', title='Placa J20 · video VGA y ATmega (MacBerry Pi G3)',
            theme=dict(board='#1b4fa8',edge='#0a2a63',track='#3f7fe0',zone='#2f69c4',pad='#d8c27a')),
 'J22':dict(src=H+'placas_individuales/J22_frontal_audio/imac_g3_slot_loading_J22_adapter_board_es.kicad_pcb',
            out=H+'placas_individuales/J22_frontal_audio/ibom_es.html', title='Placa J22 · frontal y audio (MacBerry Pi G3)',
            theme=dict(board='#5a2a8c',edge='#2d1347',track='#8d52c2',zone='#7a42ad',pad='#d8c27a')),
 'DC':dict(src=H+'placas_individuales/DownConverter/imac_g3_down_converter_board_adapter_es.kicad_pcb',
           out=H+'placas_individuales/DownConverter/ibom_es.html', title='Placa Down Converter · breakout (MacBerry Pi G3)',
           theme=dict(board='#151515',edge='#8a8a8a',track='#444444',zone='#303030',pad='#d8c27a')),
 'MASTER':dict(src=H+'master_pcb/PCB_imac_unificado_master_v5_con_corte.kicad_pcb',
               out=H+'master_pcb/ibom_master.html', title='PCB master v5 · iMac G3 + Pi 5 (MacBerry Pi G3)',
               theme=dict(board='#1f6b3b',edge='#0c3a1d',track='#43a766',zone='#34915a',pad='#d8c27a')),
}
HTML_TR=[
 ('Dark mode','Modo oscuro'),('Full Screen','Pantalla completa'),('Fab layer','Capa Fab'),('>\n            Silkscreen','>\n            Serigrafía'),
 ('            References\n','            Referencias\n'),('            Values\n','            Valores\n'),
 ('              Tracks\n','              Pistas\n'),('              Zones\n','              Zonas\n'),
 ('            Pads\n','            Pads\n'),('DNP outlined','DNP con contorno'),('Highlight row on click','Resaltar fila al hacer clic'),
 ('Continuous redraw on drag','Redibujar al arrastrar'),('Highlight first pin','Resaltar el pin 1'),
 ('                  None\n','                  Ninguno\n'),('                  All\n','                  Todos\n'),('                  Selected\n','                  Seleccionado\n'),
 ('Board rotation','Rotación de la placa'),('Offset back rotation','Compensar rotación trasera'),('Bom checkboxes','Casillas del BOM'),
 ('Mark when checked','Marcar al activar'),('Created using','Creado con'),
 ('title="Front only"','title="Solo cara frontal"'),('title="Front and Back"','title="Frontal y trasera"'),('title="Back only"','title="Solo cara trasera"'),
 ('title="BOM only"','title="Solo BOM"'),('title="BOM left, drawings right"','title="BOM a la izquierda, placa a la derecha"'),('title="BOM top, drawings bot"','title="BOM arriba, placa abajo"'),
 ('title="Grouped BOM"','title="BOM agrupado"'),('title="Ungrouped BOM"','title="BOM sin agrupar"'),('title="Netlist"','title="Lista de redes"'),
 ('Board stats','Estadísticas'),('>Front</td>','>Frontal</td>'),('>Back</td>','>Trasera</td>'),('>Components</td>','>Componentes</td>'),('>Groups</td>','>Grupos</td>'),
 ('>SMD pads</td>','>Pads SMD</td>'),('>TH pads</td>','>Pads TH</td>'),('Checkboxes</td>','Casillas</td>'),
 ('Save board image','Guardar imagen de la placa'),('placeholder="Width"','placeholder="Ancho"'),('placeholder="Height"','placeholder="Alto"'),
 ('Transparent background','Fondo transparente'),('>Front</button>','>Frontal</button>'),('>Back</button>','>Trasera</button>'),
 ('Config and checkbox state','Configuración y casillas'),('>Export</button>','>Exportar</button>'),('>Import</button>','>Importar</button>'),('>Reset</button>','>Restablecer</button>'),
 ('Save bom table as','Guardar tabla BOM como'),('placeholder="Ref lookup"','placeholder="Buscar referencia"'),('placeholder="Filter"','placeholder="Filtrar"'),
 ('title="Copy bom table to clipboard"','title="Copiar la tabla BOM"'),
]
I18N={"References":"Referencias","Value":"Valor","Footprint":"Huella","Quantity":"Cant.","Net name":"Red","Color":"Color"}
TEMPLATE = H + 'placas_individuales/J20_video/fabricacion/bom/ibom.html'   # iBOM v2.11.2 original del proyecto
tmpl = open(TEMPLATE, encoding='utf8').read()
def build(key):
    b=BOARDS[key]
    d=k2i.convert(b['src'],title=b['title'],company='JJaroll.dev · MacBerry Pi G3')
    t=b['theme']; d['board_color']=t['board']
    comp = compress_to_base64(json.dumps(d, separators=(',', ':')))
    h=tmpl
    h=re.sub(r'(LZString\.decompressFromBase64\(")[^"]+("\))',lambda m:m.group(1)+comp+m.group(2),h,count=1)
    h=h.replace('"checkboxes": "Sourced,Placed"','"checkboxes": "Comprado,Colocado"',1)
    h=h.replace('<html lang="en">','<html lang="es">',1)
    h=h.replace('<title>Interactive BOM for KiCAD</title>','<title>%s</title>'%html.escape('BOM interactivo · '+b['title']),1)
    # tema
    css="""
<style type="text/css">
:root, .dark.topmostdiv {
  --pcb-edge-color: %(edge)s;
  --pad-color: %(pad)s;
  --pad-hole-color: #1a1a1a;
  --silkscreen-edge-color: #f2f2f2;
  --silkscreen-polygon-color: #f2f2f2;
  --silkscreen-text-color: #f2f2f2;
  --fabrication-edge-color: #e9d9a8;
  --fabrication-polygon-color: #e9d9a8;
  --fabrication-text-color: #e9d9a8;
  --track-color: %(track)s;
  --zone-color: %(zone)s;
}
.bom th[col_name="bom-checkbox"] { min-width: 66px; }
</style>
</head>"""%t
    h=h.replace('</head>',css,1)
    # relleno de la placa
    fn="""function drawBoardFill(canvas) {
  if (!pcbdata.board_path || !pcbdata.board_color) return;
  var ctx = canvas.getContext("2d");
  if (!pcbdata.board_path2d) pcbdata.board_path2d = new Path2D(pcbdata.board_path);
  ctx.save();
  ctx.fillStyle = pcbdata.board_color;
  ctx.fill(pcbdata.board_path2d, "evenodd");
  ctx.restore();
}

function drawBackground(canvasdict, clear = true) {"""
    assert 'function drawBackground(canvasdict, clear = true) {' in h
    h=h.replace('function drawBackground(canvasdict, clear = true) {',fn,1)
    old="  drawNets(canvasdict.bg, canvasdict.layer, false);\n  drawFootprints(canvasdict.bg"
    assert old in h
    h=h.replace(old,"  drawBoardFill(canvasdict.bg);\n"+old,1)
    # i18n de cabeceras
    assert '  th.innerHTML = name;' in h
    h=h.replace('  th.innerHTML = name;','  th.innerHTML = ({"References":"Referencias","Value":"Valor","Footprint":"Huella","Quantity":"Cant.","Net name":"Red"})[name] || name;',1)
    # textos HTML
    i=h.index('<body>'); head,body=h[:i],h[i:]
    miss=[]
    for a,bb in HTML_TR:
        if a not in body: miss.append(a)
        body=body.replace(a,bb)
    h=head+body
    return h,miss,d
if __name__=='__main__':
    for k in (sys.argv[1:] or list(BOARDS)):
        h,miss,d=build(k)
        open(BOARDS[k]['out'],'w',encoding='utf8').write(h)
        print(k,len(h)//1024,'KB','sin traducir:',miss)
