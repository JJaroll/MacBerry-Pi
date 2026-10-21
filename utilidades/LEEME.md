# Utilidades

**ImacG3DVDisplayProperties**: utilidad Java de qbancoffee para ajustar las propiedades de la pantalla del iMac G3 (LGPL-3.0, sin modificar). Incluye código fuente (`src/`), proyecto NetBeans y el `.jar` listo en `dist/` junto con `RXTXcomm.jar`.

Traducción de su LEEME: [`../docs/traducciones/ImacG3DVDisplayProperties_LEEME_es.txt`](../docs/traducciones/ImacG3DVDisplayProperties_LEEME_es.txt) y captura en `captura_utilidad_ajuste_LEEME_es.txt`.

**generar_ibom/**: genera el BOM interactivo (iBOM) en español de las cuatro placas desde sus `.kicad_pcb`, sin KiCad. Ver [`generar_ibom/LEEME.md`](generar_ibom/LEEME.md).

**expandir_mascara.py**: expande las aperturas de un Gerber de máscara de soldadura en N mm por lado (equivale a la *Expansión de máscara* de KiCad). Uso: `python3 utilidades/expandir_mascara.py 0.051 *_Mask.gbr` (requiere `pip install shapely`). Modifica los archivos en su lugar.

**actualizar_tamanos_sitio.py**: regenera `sitio/js/tamanos.js` (tamaños de los archivos descargables que muestra la guía interactiva). Ejecútalo tras cambiar archivos listados en `sitio/js/datos_ref.js`: `python3 utilidades/actualizar_tamanos_sitio.py`.
