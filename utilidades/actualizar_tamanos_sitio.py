#!/usr/bin/env python3
"""Genera sitio/js/tamanos.js con el tamaño en bytes de los archivos que la guía enlaza para descargar.
Lee las rutas `p: "..."` de sitio/js/datos_ref.js. Ejecútalo desde la raíz del repositorio tras cambiar archivos:
    python3 utilidades/actualizar_tamanos_sitio.py
"""
import json, os, re, sys
raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
datos = open(os.path.join(raiz, "sitio/js/datos_ref.js"), encoding="utf8").read()
rutas = sorted(set(re.findall(r'\bp: "([^"]+)"', datos)))
tam = {}
for r in rutas:
    f = os.path.join(raiz, r)
    if os.path.isfile(f):
        tam[r] = os.path.getsize(f)
    else:
        print("aviso: no existe", r, file=sys.stderr)
salida = os.path.join(raiz, "sitio/js/tamanos.js")
with open(salida, "w", encoding="utf8") as fh:
    fh.write("/* Generado por utilidades/actualizar_tamanos_sitio.py: no editar a mano. */\nwindow.MB_TAM = " + json.dumps(tam, indent=1, ensure_ascii=False) + ";\n")
print(len(tam), "archivos ->", salida)
