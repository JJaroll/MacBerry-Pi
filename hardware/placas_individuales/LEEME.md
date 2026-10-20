# Placas individuales (J20, J22 y Down Converter)

Placas de [qbancoffee](https://github.com/qbancoffee/imac_g3_ivad_board_init) (LGPL-3.0), migradas a KiCad, con la **serigrafía y los comentarios en español** y la firma **JJaroll.dev**. El bloque de título de cada archivo cita al autor original.

| Carpeta | Placa | Función |
|---|---|---|
| `J20_video/` | J20 (Rev 3) | ATmega328P: inicializa la IVAD, EDID, botón y VGA |
| `J22_frontal_audio/` | J22 (Rev 2) | Botón, LED, altavoces, audífonos, micrófono y 24 VAC |
| `DownConverter/` | Down Converter (Rev 1) | Breakout de la placa PAV: +3,3, +5, +12 V y standby |

Cada carpeta incluye `ibom_es.html`, el **BOM interactivo en español** de esa placa (J20 azul, J22 púrpura, Down Converter negro). Ábrelo con doble clic. Se genera con [`../../utilidades/generar_ibom/`](../../utilidades/generar_ibom). El iBOM original en inglés está en `fabricacion/bom/ibom.html`.

Cada carpeta trae también su `.kicad_pro` (reglas de diseño ajustadas al diseño original: distancia cobre–borde 0,2 mm y avisos de alivio térmico) y el Gerber listo para fabricar en `fabricacion/*_gerber.zip`. Abre el proyecto desde el Gestor de proyectos de KiCad para que se carguen las reglas.

## Glosario de la serigrafía

| Inglés | Español |
|---|---|
| GREEN LED / AMBER LED | LED VERDE / LED AMBAR |
| PWR BUTTON / POWER BUTTON | BOTON ENC. / BOTON ENCENDIDO |
| PWR LED | LED ENC. |
| 24 VAC OUT | SALIDA 24 VAC |
| H1/H2 RIGHT / LEFT | H1/H2 DER / IZQ |
| SPEAKERS / MICROPHONE | ALTAVOCES / MICROFONO |
| GND RD / GR / BL | GND ROJO / VERDE / AZUL |
| RED / GREEN / BLUE | ROJO / VERDE / AZUL |
| H-SYNC / V-SYNC | SINC-H / SINC-V |
| 5V TRK | 5V SEG. |
| LINE SENSE | SENSOR LINEA |
| SOLDER JP3 TO USE VSYNC DETECT | SOLDAR JP3 PARA DETECCION VSYNC |
| solder jumpers to send EDID | soldar jumper enviar EDID |
| +15V STNBY / +24 ON | +15V ESPERA / +24 ENC. |
| +8V STNBY / +12V ON | +8V ESPERA / +12V ENC. |
| FAN / FAN PWM | VENT. / PWM VENT. |

La serigrafía no lleva tildes ni eñes para que la fuente de trazo de KiCad se vea limpia. Las señales técnicas (`SDA`, `SCL`, `MOSI`, `GND`, `DCO`, `PROT`…) no se traducen.

Los originales sin modificar están en [`../../originales/`](../../originales).
