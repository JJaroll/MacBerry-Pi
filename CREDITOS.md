# Créditos

## Proyecto original

**[qbancoffee (Rocky Hill)](https://github.com/qbancoffee)** creó [`imac_g3_ivad_board_init`](https://github.com/qbancoffee/imac_g3_ivad_board_init): la ingeniería inversa de la placa IVAD, la secuencia de inicialización I²C, el firmware (Arduino y Raspberry Pi), el emulador de EDID, la utilidad Java de calibración, el [wiki](https://github.com/qbancoffee/imac_g3_ivad_board_init/wiki) y **las tres placas adaptadoras y sus esquemas** (J20, J22 y breakout del Down Converter). Licencia **LGPL-3.0**.

Todo lo que hay en `hardware/placas_individuales/` y `originales/` parte directamente de su trabajo. Los esquemas PDF de `originales/esquemas_pdf/` son suyos y se incluyen sin modificar.

## Agradecimientos del proyecto original

Tomados del README de qbancoffee:

- **patriciooholegu**: inspiración del eMac.
- **ym58**: cableado del conector de vídeo.
- **Eric Bylenga**: patillaje de la placa PAV.
- **sparpet**: captura del código de inicialización de la IVAD.
- **jamie-g**: ajuste del monitor I²C.
- **DrJekyll_XYZ**: salida `xrandr` para el EDID y sugerencia del PAM8403.
- **anotherelise**: secuencia de inicialización alterna y captura de propiedades del CRT.
- **oshimai** ([`shuuryou/imacg3`](https://github.com/shuuryou/imacg3)): extracción del EDID y monitoreo de VSYNC para apagar el CRT.
- **Tech Chrunch**: vídeo del reemplazo de altavoces.

## Contribuciones de terceros incluidas

- **Rudy ([reng.ca](https://reng.ca))**: diseño de los soportes 3D de la Raspberry Pi (`stl/rpi_mount/`: espaciador, placa de fijación y bisel de puertos) y de las placas `RPiG3iMac` del proyecto original. Cedidos al proyecto por él.
- **Anthony Bernaert** ([`anthony-bernaert/imac-g3-screen-bezel`](https://github.com/anthony-bernaert/imac-g3-screen-bezel), release `v0.1-beta.1`): diseño del bisel interior imprimible en 3D (`stl/bezel/`, 17 STL sin modificar). Licencia **CC BY-NC 4.0** (solo uso no comercial), distinta de la LGPL del resto. Su apoyo: [ko-fi.com/abernaert](https://ko-fi.com/abernaert).
- **Nicolas Robin** ([github.com/nicolas-robin](https://github.com/nicolas-robin)): escaneo 3D del bisel original que sirvió de referencia a Anthony Bernaert (compartido con su permiso; no se copia aquí).

## Trabajo en este repositorio (JJaroll.dev)

**[JJaroll.dev](https://jjaroll.dev)** (Jarol):

- Traducción al español de la documentación y la Guía MacBerry Pi.
- Traducción de la serigrafía y comentarios de las 3 placas, y firma.
- Diseño del **PCB master unificado** (v5), con bolsillos, terminales equivalentes a las borneras, rutas, Gerber, DXF/SVG y logos.
- Visores 3D y mapas de cableado.

Parte del diseño del master (enrutado, verificación geométrica, Gerber, visores) se desarrolló con ayuda de Claude (Anthropic).

## Software y recursos de terceros usados

| Recurso | Uso | Licencia |
|---|---|---|
| [three.js](https://threejs.org) r128 y `OrbitControls` | Visores 3D (incrustados en cada HTML) | MIT |
| [KiCad](https://www.kicad.org) (formato `.kicad_pcb`) y su fuente *Newstroke* | Formato de las placas y trazo del texto en serigrafía | GPL-3.0 con excepción de bibliotecas / CC-BY-SA para las fuentes |
| [gerbonara](https://github.com/jaseg/gerbonara) | Lectura y vista previa de los Gerber | Apache-2.0 |
| [segno](https://github.com/heuer/segno) | Código QR de la serigrafía del master | BSD-3-Clause |
| [InteractiveHtmlBom](https://github.com/openscopeproject/InteractiveHtmlBom) (plantilla `ibom.html`) y [lz-string](https://github.com/pieroxy/lz-string) | BOM interactivo de cada placa | MIT |
| [Fuentes Hershey](https://en.wikipedia.org/wiki/Hershey_fonts) (paquete [HersheyFonts](https://pypi.org/project/HersheyFonts/)) | Texto de la serigrafía en los iBOM | Dominio público / MIT |
| [Shapely](https://shapely.readthedocs.io), [trimesh](https://trimesh.org), [ezdxf](https://ezdxf.mozman.at) | Geometría, exportación de STL y DXF | BSD-3-Clause / MIT |
| [Outfit](https://fonts.google.com/specimen/Outfit) y [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | Tipografías de los visores (opcionales; sin internet se usa la tipografía del sistema) | SIL OFL 1.1 |

## Fotografía de referencia

El contorno 1:1 de la placa lógica 820-1131-A se reconstruyó midiendo sobre un *cutting mat* y comparándolo con la fotografía «Apple iMac G3 – motherboard (front)» del **Museo de Informática Histórica (MIH) – Universidad de Zaragoza** publicada en Wikimedia Commons (placa 820-1275-A, otra revisión). La foto se usó solo como referencia de verificación y **no se redistribuye** en este repositorio. Las medidas del master pueden diferir de la placa real en 1 mm o más: verifícalas con calibre antes de fabricar.

## Cómo citar

> MacBerry Pi G3 en español, JJaroll.dev, basado en `imac_g3_ivad_board_init` de qbancoffee (LGPL-3.0).

## Licencia

LGPL-3.0 (ver [LICENSE](LICENSE)). Las obras derivadas de este repositorio deben mantener esta licencia y conservar estos créditos.

Excepción: `stl/bezel/` es CC BY-NC 4.0 de Anthony Bernaert (ver [`stl/bezel/LICENSE_CC-BY-NC-4.0.md`](stl/bezel/LICENSE_CC-BY-NC-4.0.md)).
