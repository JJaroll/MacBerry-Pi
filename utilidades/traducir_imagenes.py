#!/usr/bin/env python3
"""Genera las versiones en español de las imágenes del proyecto original.

Lee `originales/imagenes/` (intactas) y escribe en `docs/traducciones/imagenes/`.
Parte A: fotos con rótulos amarillos/blancos (se redibuja el rótulo).
Parte B: esquemas en blanco y negro (OCR con tesseract + diccionario de frases).

Requisitos: pip install pillow opencv-python-headless pytesseract numpy; tesseract-ocr.
Fuente: Comfortaa (la del original). Pasa su ruta en MB_FUENTE (.ttf/.woff) o se usará DejaVu Sans.
"""
import os, re, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
ORIG = RAIZ / "originales" / "imagenes"
DEST = RAIZ / "docs" / "traducciones" / "imagenes"
FUENTE = os.environ.get("MB_FUENTE", "")
FALLBACK = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def fnt(size, bold=False):
    p = FUENTE
    if bold and FUENTE:
        p = FUENTE.replace("400", "700")
    for c in (p, FALLBACK):
        if c and os.path.exists(c):
            return ImageFont.truetype(c, max(6, int(round(size))))
    return ImageFont.load_default()


def ancho(txt, size, bold=False):
    return fnt(size, bold).getlength(txt)


def calibra(ingles, ancho_objetivo, bold=False):
    """Tamaño de fuente con el que `ingles` mide `ancho_objetivo` px."""
    lo, hi = 6.0, 200.0
    for _ in range(30):
        m = (lo + hi) / 2
        if ancho(ingles, m, bold) < ancho_objetivo:
            lo = m
        else:
            hi = m
    return (lo + hi) / 2


def envuelve(txt, size, maxw, bold=False):
    out, cur = [], ""
    for w in txt.split():
        t = (cur + " " + w).strip()
        if ancho(t, size, bold) <= maxw or not cur:
            cur = t
        else:
            out.append(cur); cur = w
    if cur:
        out.append(cur)
    return out


# ---------------------------------------------------------------- Parte A
def rotulo(im, caja, lineas, fg, bg, size, subrayado=True, pad=3, crece=True, bold=False, interlineado=1.2, x0=None, valign="top"):
    """Borra `caja` (x,y,w,h), la repinta con `bg` y escribe `lineas` (lista) con `fg`."""
    d = ImageDraw.Draw(im)
    x, y, w, h = caja
    anchos = [ancho(l, size, bold) for l in lineas]
    nw = max(w, int(max(anchos) + 2 * pad + 4)) if crece else w
    if x + nw > im.width - 1:  # no salirse de la imagen: desplaza el rótulo a la izquierda
        x = im.width - 1 - nw
    nh = max(h, int(len(lineas) * size * interlineado + 2 * pad)) if crece else h
    d.rectangle([x, y, x + nw, y + nh], fill=bg)
    ty = y + pad
    if valign == "center":
        ty = y + (nh - len(lineas) * size * interlineado) / 2
    for l in lineas:
        d.text((x + pad + 1, ty), l, font=fnt(size, bold), fill=fg)
        if subrayado:
            yy = ty + size * 1.05
            d.line([x + pad + 1, yy, x + pad + 1 + ancho(l, size, bold), yy], fill=fg, width=max(1, int(size / 18)))
        ty += size * interlineado
    return im


ROJO = (230, 0, 0); VERDE = (0, 255, 0); AMARILLO = (255, 255, 0); AZUL = (0, 0, 138); BLANCO = (255, 255, 255)


def fotos():
    # chassis.jpg
    im = Image.open(ORIG / "chassis.jpg").convert("RGB")
    s = calibra("This is the bottom part of the iMac", 587 - 8)
    rotulo(im, (1013, 0, 587, 87), ["Esta es la parte inferior del iMac", "mientras reposa de costado."], ROJO, AMARILLO, s, crece=False, pad=2)
    s2 = calibra("J22 connector", 249 - 8)
    rotulo(im, (633, 92, 249, 41), ["Conector J22"], ROJO, AMARILLO, s2, pad=2)
    rotulo(im, (886, 245, 242, 39), ["Conector J20"], ROJO, AMARILLO, s2, pad=2)
    s3 = calibra("Down Converter Board mount", 502 - 6)
    rotulo(im, (1098, 610, 502, 190), ["La placa lógica y la placa", "Down Converter se montan", "en este lado del chasis.", "En esta imagen ya fueron", "retiradas."], ROJO, AMARILLO, s3 * 0.92, crece=False, pad=2, interlineado=1.16)
    im.save(DEST / "chassis.jpg", quality=95)

    # logic_board_and_downconverter_board.jpg
    im = Image.open(ORIG / "logic_board_and_downconverter_board.jpg").convert("RGB")
    s = calibra("Logic Board", 223 - 8)
    rotulo(im, (429, 21, 223, 45), ["Placa lógica"], ROJO, AMARILLO, s, pad=3)
    s = calibra("Down Converter Board", 412 - 8)
    rotulo(im, (1166, 192, 412, 52), ["Placa Down Converter"], ROJO, AMARILLO, s, pad=3)
    s = calibra("48 volts AC from", 307 - 12)
    rotulo(im, (6, 469, 307, 93), ["48 V CA desde", "la placa analógica"], ROJO, AMARILLO, s, pad=3)
    s = calibra("provided by the IVAD board", 460)
    rotulo(im, (1025, 8, 475, 113), ["5 VDC de reserva (trickle)", "entregados por la placa IVAD", "a través del conector J20"], VERDE, AZUL, s, pad=2, interlineado=1.2)
    im.save(DEST / "logic_board_and_downconverter_board.jpg", quality=95)

    # analog_board.jpg
    im = Image.open(ORIG / "analog_board.jpg").convert("RGB")
    s = calibra("This is the top part of the iMac", 538 - 8)
    rotulo(im, (1047, 16, 538, 52), ["Esta es la parte superior del iMac"], ROJO, AMARILLO, s, pad=2)
    s = calibra("Analog Board", 248 - 8)
    rotulo(im, (262, 178, 248, 42), ["Placa analógica"], ROJO, AMARILLO, s, pad=2)
    s = calibra("IVAD Board", 207 - 8)
    rotulo(im, (1393, 224, 207, 42), ["Placa IVAD"], ROJO, AMARILLO, s, pad=2)
    s = calibra("Mains Power", 241 - 8)
    rotulo(im, (703, 752, 241, 45), ["Entrada de red"], ROJO, AMARILLO, s, pad=2)
    im.save(DEST / "analog_board.jpg", quality=95)

    # J20_and_J22_in_view.jpg  (rótulos blancos, sin subrayado)
    im = Image.open(ORIG / "J20_and_J22_in_view.jpg").convert("RGB")
    s = calibra("J22 board.", 171 - 20)
    rotulo(im, (731, 58, 171, 34), ["Placa J22."], ROJO, BLANCO, s, subrayado=False, pad=8, crece=False)
    s = calibra("J20 board", 175 - 20)
    rotulo(im, (1285, 294, 175, 38), ["Placa J20"], ROJO, BLANCO, s, subrayado=False, pad=8, crece=False)
    im.save(DEST / "J20_and_J22_in_view.jpg", quality=95)

    # harness.jpg (rótulos amarillos, negrita pequeña salvo algunos grandes)
    im = Image.open(ORIG / "harness.jpg").convert("RGB")
    R = ROJO
    rotulo(im, (74, 132, 56, 30), ["DCO"], R, AMARILLO, 17, subrayado=False, pad=1, bold=True)
    s = calibra("Modified header with wires soldered to", 401 - 8, bold=True)
    rotulo(im, (1190, 203, 401, 53), ["Header modificado con cables soldados.", "Se enchufa en el conector J20"], R, AMARILLO, s * 0.94, subrayado=False, pad=2, bold=True, interlineado=1.15)
    rotulo(im, (317, 285, 157, 31), ["Tensión trickle"], R, AMARILLO, calibra("Trickle voltage", 157 - 8, bold=True), subrayado=False, pad=2, bold=True)
    rotulo(im, (286, 463, 51, 27), ["PFW"], R, AMARILLO, 17, subrayado=False, pad=1, bold=True)
    rotulo(im, (237, 523, 35, 27), ["LP"], R, AMARILLO, 17, subrayado=False, pad=1, bold=True)
    s = calibra("I2C lines or", 178 - 6)
    rotulo(im, (710, 538, 178, 63), ["Líneas I²C o", "SDA y SCL"], R, AMARILLO, s, subrayado=False, pad=2, interlineado=1.15)
    s = calibra("DE15 or VGA", 184 - 6)
    rotulo(im, (1386, 667, 184, 60), ["DE15 o conector", "VGA"], R, AMARILLO, s * 0.93, subrayado=False, pad=2, interlineado=1.15)
    s = calibra("GROUND", 140)
    rotulo(im, (374, 693, 244, 72), ["TIERRA (GND)", "¡Muy importante!"], R, AMARILLO, s * 0.95, subrayado=False, pad=3, interlineado=1.15)
    rotulo(im, (636, 762, 177, 30), ["Se enchufa al Arduino"], R, AMARILLO, calibra("Plugs into Arduino", 177 - 8, bold=True), subrayado=False, pad=2, bold=True)
    im.save(DEST / "harness.jpg", quality=95)



# ---------------------------------------------------------------- Parte B
import cv2
import pytesseract
from pytesseract import Output

COLORES = {"YELLOW": "AMARILLO", "BLACK": "NEGRO", "PINK": "ROSADO", "GREY": "GRIS", "GRAY": "GRIS", "VIOLET": "VIOLETA",
           "BROWN": "MARRÓN", "ORANGE": "NARANJA", "TEAL": "TURQUESA", "WHITE": "BLANCO", "BLUE": "AZUL", "GREEN": "VERDE", "RED": "ROJO",
           "BROWN/W": "MARRÓN/B", "YELLOW/BK": "AMARILLO/NG", "BLACK/W": "NEGRO/B", "RED/W": "ROJO/B", "STANDBY": "en espera"}

# compacto (minúsculas, sin espacios) -> español, para líneas numeradas de las tablas de pines
ITEMS = {
    "microphone-": "Micrófono -", "microphoneshield": "Malla del micrófono", "microphone+": "Micrófono +",
    "h2-right": "H2 - Der.", "h2-left": "H2 - Izq.", "h2-sense": "H2 - detección", "h1-right": "H1 - Der.", "h1-left": "H1 - Izq.",
    "h1-sense": "H1 - detección", "noconnection": "sin conexión", "+rightspeaker": "+Parlante der.", "-rightspeaker": "-Parlante der.",
    "+leftspeaker": "+Parlante izq.", "-leftspeaker": "-Parlante izq.", "powerbutton": "botón de encendido", "common": "común",
    "greenled": "LED verde", "amberled": "LED ámbar", "bluesignal": "señal AZUL", "greensignal": "señal VERDE", "redsignal": "señal ROJA",
    "l/slinesense": "SENS. LÍNEA L/S", "gnd-blue": "GND-AZUL", "gnd-green": "GND-VERDE", "gnd-red": "GND-ROJO",
    "svtrickle": "5V TRICKLE", "5vtrickle": "5V TRICKLE",
}

# regex (sobre texto en minúsculas) -> español. Se aplica a segmentos (líneas) completos.
FRASES = [
    (r"imac g.? slot loading model vga adapter", "Adaptador VGA, modelo iMac G3 slot loading"),
    (r"imac g.? slot loading model$", "Modelo iMac G3 slot loading"),
    (r"chassis connectors and power switch", "conectores del chasis y botón de encendido"),
    (r"connections to power on and off", "Conexiones para encender y apagar"),
    (r"powering down.?converter board", "Alimentación de la placa down-converter"),
    (r"based on ym.?.?.?s pinout", "Basado en el pinout de ym58 en macrumors"),
    (r"wiring slot loading imac g.? to an arduino uno", "Cableado del iMac G3 slot loading a un Arduino Uno"),
    (r"wiring slot loading imac g.? to an arduino nano", "Cableado del iMac G3 slot loading a un Arduino Nano"),
    (r"wiring slot loading imac g.? to a raspberry pi", "Cableado del iMac G3 slot loading a una Raspberry Pi"),
    (r"^to use as a monitor", "para usarlo como monitor"),
    (r"^to transmit edid", "para transmitir EDID"),
    (r"using an arduino uno as a programmer", "Uso de un Arduino UNO como programador"),
    (r"basic wiring for the adapter boards", "Cableado básico de las placas adaptadoras"),
    (r"^right speaker$", "PARLANTE DERECHO"), (r"^left speaker$", "PARLANTE IZQUIERDO"), (r"^chassis$", "CHASIS"),
    (r"dual headphone jack", "Jack doble de audífonos"),
    (r"j20 wire colors", "COLORES DE CABLE J20"),
    (r"^to raspberry pi", "A RASPBERRY PI"), (r"^or arduino$", "O ARDUINO"),
    (r"sends edid to", "Envía el EDID a un"), (r"^computer$", "computador"),
    (r"initializes ivad", "Inicializa el IVAD"),
    (r"male vga cable", "CABLE VGA MACHO"),
    (r"^hdmi to vga", "HDMI A VGA"), (r"^converter$", "CONVERTIDOR"),
    # nota J20/J22 (conectores_and_boards)
    (r"references for the mating", "J20 y J22 son referencias de los conectores de la"),
    (r"on the logic board\.", "placa lógica con los que se acoplan. Los usé aquí"),
    (r"they mate to\.", "para saber a qué se conectan. Esto es lo que verías"),
    (r"^bottom of the computer", "al mirar la parte inferior del computador."),
    # PAV
    (r"^bottom$", "Parte inferior"),
    (r"this side faces the chas", "este lado mira al chasis cuando"), (r"^mounted$", "está montada"),
    (r"molex pin assig", "Pines Molex usados en el esquema"),
    (r"down.?converter pin assignment used", "Pines del down-converter según LG/Apple"),
    (r"this is what you would see if", "Vista directa de la cara de la placa"),
    (r"at the face of the down", "down-converter, del lado del"),
    (r"^connector$", "conector"),
    (r"down converter on", "Down Converter encendido (DCO)"),
    (r"the on signal is sent", "La señal de encendido llega a la"),
    (r"down.?converter board from", "placa down-converter desde la placa"),
    (r"the analog board via j20", "analógica por J20."),
    (r"^\+12v when on$", "+12v encendido"), (r"^\+24v when on$", "+24v encendido"),
    (r"^common$", "COMÚN"), (r"green light", "LUZ VERDE"), (r"amber light", "LUZ ÁMBAR"),
    (r"^pin (\d+) on j22", "PIN \\1 EN J22"),
    (r"^caution", "¡PRECAUCIÓN!"),
    (r"when the crt is on", "Con la CRT encendida hay MILES de voltios en el flyback."),
    (r"touch the crt or", "No toques la CRT ni el cable que va a ella desde el flyback."),
    (r"^using a wire", "CON UN CABLE, UNE LOS PINES"), (r"^6,? ?10 and 12", "6, 10 Y 12 Y ENVÍA LA"), (r"^sequence$", "SECUENCIA DE INICIALIZACIÓN"),
    (r"^disconnect pin 6", "DESCONECTA EL PIN 6 (5V TRICKLE)"),
    (r"^device microphone", "Micrófono del dispositivo"), (r"^audio from device", "Audio del dispositivo"),
    (r"all of the mounting holes", "Todos los orificios de montaje son"),
    (r"common ground\. once", "masa común. Una vez atornilladas,"),
    (r"in, the boards will", "las placas quedan unidas a la masa"),
    (r"^chassis ground", "del chasis."),
    (r"^down converter$", "Placa breakout"), (r"^breakout board$", "del Down Converter"),
]



def segmentos(im, escala, gap=14):
    """OCR en varias escalas; une los segmentos nuevos que no solapan con los ya encontrados."""
    base = _segmentos(im, escala, gap)
    for e2 in ([escala + 1, max(1, escala - 1)] if escala > 1 else []):
        for s in _segmentos(im, e2, gap):
            cx, cy = (s["b"][0] + s["b"][2]) / 2, (s["b"][1] + s["b"][3]) / 2
            if not any(b["b"][0] - 2 <= cx <= b["b"][2] + 2 and b["b"][1] - 2 <= cy <= b["b"][3] + 2 for b in base):
                base.append(s)
    return base


def _segmentos(im, escala, gap=14):
    W, H = im.size
    big = im.resize((int(W * escala), int(H * escala)), Image.LANCZOS) if escala != 1 else im
    d = pytesseract.image_to_data(big, config="--psm 11", output_type=Output.DICT)
    palabras = []
    for i, tx in enumerate(d["text"]):
        if not (re.search(r"[A-Za-z0-9]", tx) or re.fullmatch(r"[+\-–—]", tx.strip())) or float(d["conf"][i]) < 35:
            continue
        x, y, w, h = [d[a][i] / escala for a in ("left", "top", "width", "height")]
        palabras.append(dict(t=tx, b=[x, y, x + w, y + h], k=(d["block_num"][i], d["par_num"][i], d["line_num"][i])))
    grupos = {}
    for w in palabras:
        grupos.setdefault(w["k"], []).append(w)
    segs = []
    for ws in grupos.values():
        ws.sort(key=lambda w: w["b"][0])
        cur = [ws[0]]
        for w in ws[1:]:
            if w["b"][0] - cur[-1]["b"][2] > gap:
                segs.append(cur); cur = [w]
            else:
                cur.append(w)
        segs.append(cur)
    out = []
    for s in segs:
        b = [min(w["b"][0] for w in s), min(w["b"][1] for w in s), max(w["b"][2] for w in s), max(w["b"][3] for w in s)]
        out.append(dict(t=" ".join(w["t"] for w in s), b=b, w=s))
    return out


def tinta(im, b):
    a = np.array(im.crop(tuple(int(v) for v in b)).convert("RGB")).reshape(-1, 3)
    if len(a) == 0:
        return (0, 0, 0)
    oscuros = a[a.sum(1) < 300]
    return tuple(int(v) for v in np.median(oscuros, 0)) if len(oscuros) > 3 else (0, 0, 0)


def borra_y_escribe(im, b, ingles, es, ancla="izq", maxw=None, bg=(255, 255, 255), pad=1, color=None, ops=None):
    """Calcula (y opcionalmente difiere) el borrado y el nuevo texto. Con `ops` lista, solo encola."""
    x0, y0, x1, y1 = b
    col = color or tinta(im, b)
    ow = x1 - x0
    s = calibra(ingles, ow) if ingles and ow > 8 else (y1 - y0) * 1.1
    s = min(max(s, (y1 - y0) * 0.9), (y1 - y0) * 1.45)
    w = ancho(es, s)
    lim = maxw if maxw else max(ow * 1.6, ow + 90)
    lim = min(lim, im.width - 26 - (x0 if ancla == "izq" else 0))
    if w > lim:
        s *= lim / w; w = ancho(es, s)
    if ancla == "der":
        x = x1 - w
    elif ancla == "centro":
        x = (x0 + x1) / 2 - w / 2
    else:
        x = x0
    rect = [min(x, x0) - pad, y0 - pad, max(x + w, x1) + pad, y1 + pad]
    op = (rect, (x, y0, x1, y1), es, s, col, bg)
    if ops is not None:
        ops.append(op)
    else:
        _pinta([op], im)


def _pinta(ops, im):
    d = ImageDraw.Draw(im)
    for rect, *_ in ops:
        d.rectangle(rect, fill=ops[0][5])
    for rect, (x, y0, x1, y1), es, s, col, bg in ops:
        f = fnt(s)
        asc = f.getbbox("H")[1]
        d.text((x, y0 - asc + (y1 - y0 - (f.getbbox("H")[3] - asc)) / 2 + 1), es, font=f, fill=col)


def norm(s):
    return re.sub(r"\s+", "", s.lower())


ACTUAL = ""


def traduce_texto(txt):
    """-> español o None. Frases completas, líneas numeradas, o None."""
    low = txt.lower().strip()
    if ACTUAL == "crt_power_on_and_off.png":
        if low == "on":
            return "ENCENDIDO"
        if low == "off":
            return "APAGADO"
    for rx, es in FRASES:
        m0 = re.search(rx, low)
        if m0:
            return m0.expand(es) if "\\" in es else es
    ms = re.match(r"^(\d+)\s*(\*?)\s*(blue|green|red)\s*s[il1]gna[l1]", low)
    if ms:
        return f"{ms.group(1)} {ms.group(2)}SEÑAL " + {"blue": "AZUL", "green": "VERDE", "red": "ROJA"}[ms.group(3)]
    m = re.match(r"^(\d+)\s+(.+)$", txt.strip())
    if m:
        k = norm(m.group(2)).replace("—", "-").replace("–", "-")
        k = re.sub(r"^[a-z]?(h\d)-", r"\1-", k)
        if k in ITEMS:
            return m.group(1) + " " + ITEMS[k]
    return None


def gira_bottom(im, texto="INFERIOR"):
    """Traduce el rótulo vertical «BOTTOM» de los dibujos del chasis."""
    W, H = im.size
    r = im.rotate(-90, expand=True)
    d = pytesseract.image_to_data(r.resize((r.width * 3, r.height * 3), Image.LANCZOS), config="--psm 11", output_type=Output.DICT)
    hecho = False
    for i, tx in enumerate(d["text"]):
        if re.sub(r"[^A-Za-z]", "", tx).upper() in ("BOTTOM", "BOTTON") and float(d["conf"][i]) > 30:
            x0, y0, x1, y1 = [d[a][i] / 3 for a in ("left", "top")] + [0, 0]
            w, h = d["width"][i] / 3, d["height"][i] / 3
            x0, y0, x1, y1 = d["left"][i] / 3, d["top"][i] / 3, d["left"][i] / 3 + w, d["top"][i] / 3 + h
            # coordenadas en la imagen original
            ox0, ox1, oy0, oy1 = y0, y1, H - 1 - x1, H - 1 - x0
            d2 = ImageDraw.Draw(im)
            d2.rectangle([ox0 - 1, oy0 - 1, ox1 + 1, oy1 + 1], fill=(255, 255, 255))
            s = min(calibra("BOTTOM", w) * 1.0, 40)
            while ancho(texto, s) > w * 1.5 and s > 6:
                s -= 0.5
            tw = int(ancho(texto, s)) + 4
            mask = Image.new("L", (tw, int(s * 1.5) + 2), 0)
            ImageDraw.Draw(mask).text((2, 1), texto, font=fnt(s), fill=255)
            mask = mask.rotate(90, expand=True)
            cx, cy = (ox0 + ox1) / 2, (oy0 + oy1) / 2
            im.paste((0, 0, 0), (int(cx - mask.width / 2), int(cy - mask.height / 2)), mask)
            hecho = True
    return hecho


def esquema(nombre, escala=3, gap=14, extra=None, informe=True, parches=None):
    global ACTUAL
    ACTUAL = nombre
    im = Image.open(ORIG / nombre).convert("RGB")
    segs = segmentos(im, escala, gap)
    # alineación: ¿las palabras se alinean por la derecha o por la izquierda?
    def alinea(b):
        izq = sum(1 for s in segs if abs(s["b"][0] - b[0]) <= 2)
        der = sum(1 for s in segs if abs(s["b"][2] - b[2]) <= 2)
        cen = sum(1 for s in segs if abs((s["b"][0] + s["b"][2]) / 2 - (b[0] + b[2]) / 2) <= 3 and abs(s["b"][1] - b[1]) < 60)
        if cen >= 2 and izq < 2 and der < 2:
            return "centro"
        return "der" if der > izq + 1 else "izq"

    def hueco(b, lado):
        """Espacio libre hasta el vecino más cercano en la misma fila."""
        mejor = 10 ** 6
        for s in segs:
            c = s["b"]
            if c is b or c[3] < b[1] + 2 or c[1] > b[3] - 2:
                continue
            if lado == "der" and c[0] >= b[2] - 1:
                mejor = min(mejor, c[0] - b[0] - 4)
            if lado == "izq" and c[2] <= b[0] + 1:
                mejor = min(mejor, b[2] - c[2] - 4)
        return mejor
    pend = []
    ops = []
    for s in segs:
        es = traduce_texto(s["t"]) or (extra or {}).get(s["t"].strip())
        if es:
            an = "centro" if es in ("ENCENDIDO", "APAGADO") else alinea(s["b"])
            lim = hueco(s["b"], "izq" if an == "der" else "der") if an != "centro" else (s["b"][2] - s["b"][0]) * 1.28
            borra_y_escribe(im, s["b"], s["t"], es, ancla=an, maxw=lim if lim and lim < 10 ** 5 else None, ops=ops)
            continue
        cambio = False
        for wi, w in enumerate(s["w"]):
            tk = re.sub(r"^[^A-Za-z/+-]+|[^A-Za-z/+-]+$", "", w["t"]).upper()
            pre, _, suf = tk.rpartition("-")
            if tk in COLORES:
                borra_y_escribe(im, w["b"], w["t"], COLORES[tk], ancla="izq" if wi else alinea(w["b"]), color=(0, 0, 0), ops=ops); cambio = True
            elif pre.upper() == "GND" and suf in COLORES:
                borra_y_escribe(im, w["b"], w["t"], "GND-" + COLORES[suf], ancla="izq" if wi else alinea(w["b"]), ops=ops); cambio = True
        if not cambio and informe and re.search(r"[A-Za-z]{4,}", s["t"]):
            pend.append(s["t"])
    _pinta(ops, im)
    for fn in (parches or {}).get(nombre, []):
        fn(im)
    if informe and pend:
        print("  sin traducir:", pend)
    if not gira_bottom(im) and informe:
        pass
    return im

def parche(caja, ingles, es, ancla="izq", color=(0, 0, 0)):
    """Corrección manual: texto que el OCR no detecta (caja = x0, y0, x1, y1)."""
    return lambda im: borra_y_escribe(im, caja, ingles, es, ancla=ancla, color=color)


def parche_oscuro(region, ingles, es, ancla="izq"):
    """Como `parche`, pero la caja es la de los píxeles oscuros dentro de `region`."""
    def f(im):
        a = np.array(im.crop(region).convert("L"))
        ys, xs = np.where(a < 110)
        if len(xs) == 0:
            return
        caja = (region[0] + xs.min(), region[1] + ys.min(), region[0] + xs.max() + 1, region[1] + ys.max() + 1)
        borra_y_escribe(im, caja, ingles, es, ancla=ancla, color=(0, 0, 0), pad=2)
    return f


def caja_raspberry(im):
    """Rótulo en caja «TO RASPBERRY PI / OR ARDUINO» (el OCR no lo lee por el borde)."""
    g = np.array(im.convert("L"))
    bw = (g < 110).astype(np.uint8)
    cs, _ = cv2.findContours(bw, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    for c in cs:
        x, y, w, h = cv2.boundingRect(c)
        if 120 <= w <= 160 and 34 <= h <= 56 and x > 20 and y > 300:
            ox, oy = x + 6, y + 5
            mid = y + h // 2
            parche_oscuro((ox, oy, x + w - 5, mid - 1), "TO RASPBERRY PI", "A RASPBERRY PI", "centro")(im)
            parche_oscuro((ox, mid, x + w - 5, y + h - 4), "OR ARDUINO", "O ARDUINO", "centro")(im)
            return True
    return False


def parche_vertical(region, es, ingles_largo=None):
    """Texto girado 90° (se lee de arriba abajo) dentro de `region`: se borra y se reescribe."""
    def f(im):
        a = np.array(im.crop(region).convert("L"))
        ys, xs = np.where(a < 110)
        if len(xs) == 0:
            return
        x0, x1, y0, y1 = region[0] + xs.min(), region[0] + xs.max() + 1, region[1] + ys.min(), region[1] + ys.max() + 1
        d = ImageDraw.Draw(im)
        d.rectangle([x0 - 1, y0 - 1, x1 + 1, y1 + 1], fill=BLANCO)
        largo = y1 - y0
        s = calibra(ingles_largo or "MALE VGA CABLE", largo)
        while ancho(es, s) > largo and s > 6:
            s -= 0.5
        tw = int(ancho(es, s)) + 4
        m = Image.new("L", (tw, int(s * 1.5) + 2), 0)
        ImageDraw.Draw(m).text((2, 1), es, font=fnt(s), fill=255)
        m = m.rotate(-90, expand=True)
        im.paste((0, 0, 0), (int((x0 + x1) / 2 - m.width / 2), int((y0 + y1) / 2 - m.height / 2)), m)
    return f


def borra(caja):
    return lambda im: ImageDraw.Draw(im).rectangle(caja, fill=BLANCO)


def parche_base(region, es, x, base, size):
    """Borra los píxeles oscuros de `region` y escribe `es` con línea base `base` (tamaño fijo)."""
    def f(im):
        a = np.array(im.crop(region).convert("L"))
        ys, xs = np.where(a < 110)
        if len(xs):
            ImageDraw.Draw(im).rectangle([region[0] + xs.min() - 2, region[1] + ys.min() - 2, region[0] + xs.max() + 2, region[1] + ys.max() + 2], fill=BLANCO)
        ImageDraw.Draw(im).text((x, base), es, font=fnt(size), fill=(0, 0, 0), anchor="ls")
    return f


PARCHES = {
    "basic_wiring.png": [parche_base((1230, 535, 1530, 592), "Micrófono", 1238, 583, 50), parche_base((1230, 593, 1534, 672), "del equipo", 1238, 638, 50),
                         parche_base((1230, 715, 1530, 785), "Audio del", 1238, 755, 50), parche_base((1230, 786, 1530, 840), "equipo", 1238, 808, 50)],
    "vga_adapter.png": [caja_raspberry],
    "arduino_uno_wiring_to_transmit_edid.png": [caja_raspberry],
    "arduino_nano_wiring_to_transmit_edid.png": [caja_raspberry],
    "raspberry_pi_wiring.png": [parche_vertical((648, 490, 671, 626), "CABLE VGA MACHO")],
    "imac_g3_slot_loading_pav_board.png": [borra((660, 293, 680, 311)),
        parche((474, 598, 552, 609), "+15v standby", "+15v en espera"), parche((474, 611, 552, 621), "+24v when on", "+24v encendido"),
        parche((667, 568, 742, 579), "+8v standby", "+8v en espera"), parche((667, 581, 743, 592), "+12v when on", "+12v encendido")],
}

INTER = "/usr/share/fonts/opentype/inter/Inter-Regular.otf"
INTER_B = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"


def _f(path, size):
    return ImageFont.truetype(path if os.path.exists(path) else FALLBACK, int(size))


def manual_apple():
    """Captura del manual de servicio de Apple (removing_down_converter_board.png)."""
    im = Image.open(ORIG / "removing_down_converter_board.png").convert("RGB")
    d = ImageDraw.Draw(im)
    # cabecera
    d.rectangle([92, 12, 228, 42], fill=BLANCO); d.text((95, 14), "Desarmado", font=_f(INTER, 24), fill=(0, 0, 0))
    d.rectangle([785, 12, 1114, 38], fill=BLANCO)
    tx = "Placa Down Converter - 51"
    d.text((1110 - _f(INTER, 24).getlength(tx), 14), tx, font=_f(INTER, 24), fill=(0, 0, 0))
    # texto del paso
    d.rectangle([762, 76, 1132, 480], fill=BLANCO)
    d.text((770, 84), "6.", font=_f(INTER, 24), fill=(0, 0, 0))
    palabras = [(w, False) for w in "Sujetando las placas, presiona el conector negro y separa la placa down converter de la placa lógica.".split()]
    pal2 = [("Nota de reemplazo:", True)] + [(w, False) for w in "Al reinstalar la placa lógica, asegúrate de que el cable de la antena no quede debajo de la placa.".split()]

    def parrafo(ws, y):
        x, x0, xmax = 815, 815, 1112
        for w, b in ws:
            f = _f(INTER_B if b else INTER, 24)
            wl = f.getlength(w + " ")
            if x + f.getlength(w) > xmax:
                x = x0; y += 34
            d.text((x, y), w, font=f, fill=(0, 0, 0)); x += wl
        return y + 34
    y = parrafo(palabras, 84)
    parrafo(pal2, y + 12)
    # rótulos de la foto
    d.rectangle([362, 116, 504, 198], fill=BLANCO)
    d.text((366, 118), "Placa Down", font=_f(INTER, 21), fill=(0, 0, 0)); d.text((366, 142), "Converter", font=_f(INTER, 21), fill=(0, 0, 0))
    d.rectangle([446, 208, 602, 238], fill=BLANCO); d.text((449, 211), "Placa lógica", font=_f(INTER, 22), fill=(0, 0, 0))
    d.rectangle([262, 660, 402, 688], fill=BLANCO); d.text((265, 663), "Conector", font=_f(INTER, 22), fill=(0, 0, 0))
    im.save(DEST / "removing_down_converter_board.png")


def osciloscopio(nombre, ingles, es, bold_size=None):
    """Sustituye el rótulo rojo superpuesto a la captura del osciloscopio."""
    im = Image.open(ORIG / nombre).convert("RGB")
    a = np.array(im).astype(int)
    m = ((a[..., 0] > 190) & (a[..., 1] < 70) & (a[..., 2] < 70)).astype(np.uint8)
    dil = cv2.dilate(m, np.ones((15, 45), np.uint8))
    n, lab = cv2.connectedComponents(dil)
    mejor = max(range(1, n), key=lambda k: int(m[lab == k].sum()))
    m = (m * (lab == mejor)).astype(np.uint8)
    ys, xs = np.where(m)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    mm = cv2.dilate(m * 255, np.ones((7, 7), np.uint8))
    lim = cv2.inpaint(np.array(im), mm, 5, cv2.INPAINT_TELEA)
    im = Image.fromarray(lim)
    s = calibra(ingles, x1 - x0, bold=True)
    while ancho(es, s, True) > (x1 - x0) * 1.15 and s > 8:
        s -= 1
    d = ImageDraw.Draw(im)
    f = fnt(s, True)
    w = ancho(es, s, True)
    d.text(((x0 + x1) / 2 - w / 2, (y0 + y1) / 2 - s * 0.62), es, font=f, fill=(230, 0, 0))
    im.save(DEST / nombre, quality=95)


GRANDES = ["arduino_uno_isp.png", "basic_wiring.png"]
ESQUEMAS = ["connectors_and_boards.png", "crt_power_on_and_off.png", "vga_adapter.png", "arduino_uno_wiring.png",
            "arduino_uno_wiring_to_transmit_edid.png", "arduino_nano_wiring.png", "arduino_nano_wiring_to_transmit_edid.png",
            "raspberry_pi_wiring.png", "imac_g3_slot_loading_pav_board.png"]

if __name__ == "__main__":
    DEST.mkdir(parents=True, exist_ok=True)
    solo = sys.argv[1:]
    if not solo or "fotos" in solo:
        fotos(); print("fotos listas")
    for n in ESQUEMAS:
        if solo and n not in solo and "esquemas" not in solo:
            continue
        print(n)
        esquema(n, parches=PARCHES).save(DEST / n)
    if not solo or "manual" in solo:
        manual_apple()
        osciloscopio("analog_board_off.jpg", "POWERED OFF", "APAGADO")
        osciloscopio("analog_board_on.jpg", "Powered ON", "ENCENDIDO")
    for n in GRANDES:
        if solo and n not in solo and "esquemas" not in solo:
            continue
        print(n)
        esquema(n, escala=1, gap=70, parches=PARCHES).save(DEST / n)
