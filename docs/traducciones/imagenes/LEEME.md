# Imágenes traducidas al español

Versiones en español de los esquemas y fotos rotuladas del proyecto original de qbancoffee / Rocky Hill (LGPL-3.0). Los originales en inglés siguen intactos en [`../../../originales/imagenes/`](../../../originales/imagenes).

- Se generan con [`utilidades/traducir_imagenes.py`](../../../utilidades/traducir_imagenes.py) (OCR con tesseract, diccionario de frases y retoques manuales). Para volver a generarlas: `MB_FUENTE=/ruta/comfortaa-latin-400-normal.woff python3 utilidades/traducir_imagenes.py`.
- Se tradujeron los rótulos, títulos y nombres de colores. Se dejaron en inglés las señales y nombres propios (SDA, SCL, GND, H-SYNC, V-SYNC, PROT, PFW, DCO, TRICKLE, DE15, HDMI) y la serigrafía impresa en las placas fotografiadas o renderizadas.
- Sin traducir porque el texto pertenece a la propia placa: `J20_board*.png`, `J22_board.png`, `down_converter_breakout_board*.png|jpg`, `imac_g3_adapter_boards.png` y las fotos de montaje. Las placas de este repositorio ya llevan serigrafía en español.
