# MacBerry Pi G3 · en español

Convierte un **iMac G3 DV (slot loading)** en un equipo moderno: una **Raspberry Pi 5** dentro de la carcasa que usa el **tubo CRT original como monitor VGA**, con sus altavoces y su botón de encendido. Reversible: no hay que cortar nada del iMac.

Este repositorio reúne **la documentación en español**, las **tres placas del proyecto original traducidas**, un **PCB master unificado** que reemplaza el cableado entre ellas, y **visores 3D** (HTML autónomo y STL) para revisarlo todo sin instalar nada.

> **Proyecto original:** [`qbancoffee/imac_g3_ivad_board_init`](https://github.com/qbancoffee/imac_g3_ivad_board_init) (LGPL-3.0), de **Rocky Hill (qbancoffee)**. Este trabajo es derivado de él: ver [CREDITOS.md](CREDITOS.md).

> ⚠️ **Riesgo:** el CRT retiene carga aunque esté desenchufado, el bisel interior es muy frágil y la estática daña la electrónica. Hazlo bajo tu propia responsabilidad.

## Por dónde empezar

1. Lee la [**Guía de cableado con Raspberry Pi 5**](docs/guia_cableado_pi5.md) (pines verificados, jumpers, alimentación y pruebas) y, como contexto, la [guía completa de implementación](docs/guia_macberry_pi.md).
2. Abre los visores de [`visores/`](visores) con doble clic para ver el montaje.
3. Elige el camino de construcción: [placas individuales o PCB master](#placas-individuales-o-master).

## Estructura

```
Macberri Pi/
├─ README.md · CREDITOS.md · LICENSE
├─ docs/
│  ├─ guia_macberry_pi.md              guía completa de implementación (traducción y adaptación)
│  ├─ guia_cableado_pi5.md             cableado, pines verificados, jumpers y pruebas con Pi 5
│  ├─ informe_master_v5.md             informe del PCB master
│  ├─ traducciones/                    README y notas del proyecto original, en español
│  └─ historial/                       informes de versiones anteriores (fusión, v2–v4)
├─ hardware/
│  ├─ placas_individuales/             J20, J22 y Down Converter: KiCad con serigrafía en español y firma,
│  │                                   esquemático_es/ (esquema traducido) y fabricacion/ (Gerber, BOM, iBOM)
│  ├─ master_pcb/                      master v5: KiCad, Gerber, DXF/SVG 1:1, vistas previas
│  └─ contribuciones_rudy/             HAT RPiG3iMac y breakout J20 de Rudy (reng.ca), KiCad + Gerber
├─ firmware/                           Arduino (inicialización IVAD, simulador EDID), init_ivad.py y edid.bin
├─ utilidades/                         ImacG3DVDisplayProperties (calibración de pantalla, Java)
├─ visores/                            HTML autónomos: 3D, cableado sin master, cableado con master, visor STL
├─ stl/
│  ├─ pcb/                             master y placas individuales en STL (1:1, 1,6 mm)
│  ├─ rpi_mount/                       soporte de la Pi (Rudy, reng.ca)
│  └─ bezel/                           bisel interior de Anthony Bernaert (17 STL, CC BY-NC 4.0)
└─ originales/                         de qbancoffee, sin modificar: esquemas PDF, proyecto KiCad (con modelos 3D), imágenes (fotos a 1600 px),
                                       raw_data (capturas I²C y EDID) y surfacemount_version (SMD, en desarrollo)
```

## Visores

| Archivo | Para qué sirve |
|---|---|
| [`visores/visor3d_pcbs.html`](visores/visor3d_pcbs.html) | **Todo en 3D**: master con las 3 placas en sus bolsillos, la Pi 5 con su case, cables cortos, rutas, logos y despiece |
| [`visores/cableado_sin_master.html`](visores/cableado_sin_master.html) | **Sistema de cables sin master**: 19 cables punto a punto entre placas, amplificador y GPIO de la Pi |
| [`visores/cableado_con_master.html`](visores/cableado_con_master.html) | **Sistema con master**: 20 rutas de cobre y cables cortos entre cada bornera y su terminal |
| [`visores/visor_inner_bezel.html`](visores/visor_inner_bezel.html) | **Visor STL del inner bezel (bisel interior)**: las 17 piezas embebidas, ensamblaje, vista explosionada, orden de montaje, cotas, medidas, piezas con soportes sobre la cama y descarga en .zip |

Funcionan con doble clic y sin internet (three.js y los STL van incrustados). Solo las tipografías de algunos visores vienen de Google Fonts; sin conexión se usa la del sistema.

## BOM interactivo (iBOM)

Cada placa tiene su BOM interactivo en español: lista de componentes, posición en la placa (cara frontal y trasera), pistas, zonas y serigrafía. Se abren con doble clic. Colores base: J20 azul, J22 púrpura, Down Converter negro y master verde.

| Placa | iBOM |
|---|---|
| PCB master v5 | [`hardware/master_pcb/ibom_master.html`](hardware/master_pcb/ibom_master.html) |
| J20 · video y ATmega | [`hardware/placas_individuales/J20_video/ibom_es.html`](hardware/placas_individuales/J20_video/ibom_es.html) |
| J22 · frontal y audio | [`hardware/placas_individuales/J22_frontal_audio/ibom_es.html`](hardware/placas_individuales/J22_frontal_audio/ibom_es.html) |
| Down Converter | [`hardware/placas_individuales/DownConverter/ibom_es.html`](hardware/placas_individuales/DownConverter/ibom_es.html) |

Se generan con [`utilidades/generar_ibom/`](utilidades/generar_ibom), sin KiCad. Los iBOM originales (en inglés) siguen en `originales/` y en `fabricacion/bom/`.

## Placas individuales o master

- **Placas individuales** ([`hardware/placas_individuales/`](hardware/placas_individuales)): el diseño original con sus borneras y el cableado de siempre. Es lo más sencillo de fabricar y ensamblar (todo *through-hole*). Serigrafía y comentarios traducidos al español y firma `JJaroll.dev`.
- **PCB master** ([`hardware/master_pcb/`](hardware/master_pcb)): una sola placa con la forma de la placa lógica 820-1131-A. Las 3 placas individuales se atornillan en bolsillos (holgura 0,3 mm) y el master las une con pistas, con huecos para la Raspberry Pi 5 con su case y un módulo PAM8403. Ver [`docs/informe_master_v5.md`](docs/informe_master_v5.md).

**Estado del master:** 20 de 20 conexiones verificadas con script propio y sin cortocircuitos. **No se ha ejecutado DRC en KiCad ni se ha fabricado.** Lee la sección «Antes de fabricar» del informe. Las medidas salen de fotos y de un *cutting mat*: verifica con calibre.

## Qué cambié respecto al original

- Serigrafía y comentarios de las 3 placas traducidos al español (las señales técnicas como `SDA`, `GND`, `MOSI` se mantienen).
- Firma `JJaroll.dev` y créditos en el bloque de título de cada placa.
- Documentación del proyecto original y guía MacBerry Pi (Raspberry Pi 5) en español.
- PCB master, visores, mapas de cableado y STL nuevos.

Las placas individuales incluyen su Gerber en español listo para fabricar (`fabricacion/*_gerber.zip`), con DRC revisado. Los Gerber originales (serigrafía en inglés) siguen en [`originales/proyecto_kicad_original/`](originales/proyecto_kicad_original).

## Contribuir

Issues y pull requests son bienvenidos: errores de traducción, medidas verificadas con calibre, resultados de DRC o fabricación del master.

## Licencia

[LGPL-3.0](LICENSE), igual que el proyecto original. Lo derivado se publica con la misma licencia.

**Excepción:** los STL del bisel interior (`stl/bezel/`) son obra de Anthony Bernaert bajo **[CC BY-NC 4.0](stl/bezel/LICENSE_CC-BY-NC-4.0.md)** (atribución, **solo uso no comercial**) y no están cubiertos por la LGPL. Ver [`stl/bezel/LEEME.md`](stl/bezel/LEEME.md).
