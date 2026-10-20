# Informe v2 — PCB único iMac G3 820-1131-A

Archivo: `imac_g3_820-1131-A_PCB_unico_v2.kicad_pcb` (la v1 queda intacta).

## Qué cambió respecto a la v1

**Redes unificadas** (decisión mía, fácil de deshacer renombrando la red):
- `GNDREF` (J22), `/GND` (DC) y `GND` (J20) → **`GND`**. Un vertido GND global en F.Cu y B.Cu (con 0,5 mm al borde) sustituye a los 6 vertidos por placa, más 196 vías de cosido.
- `/PWR_BTN` (J20) → `/POWER_BUTTON` (J22). **Es una inferencia por el nombre**: verifica que el pulsador del J22 debe llegar al ATmega del J20.

**Huellas nuevas** (personalizadas, sin librería oficial):
- `U_AMP`: pads para el módulo PAM8403, en `(73.5; 232)`. Cuadrícula 2,54 mm, módulo estimado de 19,05 × 22,86 mm **a partir de la foto; verifica con calibre**.
- `J_AUDIO_IN`: cabecera 1×3 (L, GND, R) en `(65,2; 252,5)`.
- `J_PI_PWR`: bornero de 2 vías (paso 5,0) para +5V y GND de la Raspberry, en `(202; 138)`.
- `PI`: espacio reservado de 85 × 56 mm centrado en `(148; 128)` con 4 agujeros M2,5 (58 × 49 mm, NPTH de 2,75 mm). Orientación estándar: USB/Ethernet hacia +X. Modelo supuesto: Pi 4B/5.

**Pines del módulo PAM8403**
| Pad | Función | Red |
|---|---|---|
| 1 | L OUT − | `/-LEFT_SPEAKER` |
| 2 | L OUT + | `/+LEFT_SPEAKER` |
| 3 | R OUT + | `/+RIGHT_SPEAKER` |
| 4 | R OUT − | `/-RIGHT_SPEAKER` |
| 5 | L in | `/AUDIO_L` |
| 6 | ⊥ | `GND` |
| 7 | R in | `/AUDIO_R` |
| 8 | 5V + | `/+5V` |
| 9 | 5V − | `GND` |

## Pistas añadidas (enrutado automático, 2 capas)

| Red | Desde → hasta | Ancho | Longitud | Vías |
|---|---|---|---|---|
| `/-LEFT_SPEAKER` | U_AMP.1 → J22_J2.7 | 0.8 mm | 32.8 mm | 0 |
| `/+LEFT_SPEAKER` | U_AMP.2 → J22_J2.8 | 0.8 mm | 32.3 mm | 0 |
| `/-RIGHT_SPEAKER` | U_AMP.4 → J22_J2.9 | 0.8 mm | 45.0 mm | 0 |
| `/+RIGHT_SPEAKER` | U_AMP.3 → J22_J2.10 | 0.8 mm | 40.1 mm | 1 |
| `/AUDIO_L` | U_AMP.5 → J_AUDIO_IN.1 | 0.4 mm | 10.3 mm | 0 |
| `/AUDIO_R` | U_AMP.7 → J_AUDIO_IN.3 | 0.4 mm | 10.4 mm | 0 |
| `/+5V` | DC_J1.5 → J_PI_PWR.1 | 2.0 mm | 60.1 mm | 0 |
| `/+5V` | DC_J1.6 → U_AMP.8 | 1.0 mm | 241.3 mm | 0 |
| `/DCO` | J20_J1.5 → DC_J2.1 | 0.4 mm | 176.2 mm | 0 |
| `/+AC` | J22_J2.1 → DC_J2.4 | 0.5 mm | 270.8 mm | 0 |
| `/-AC` | J22_J2.2 → DC_J2.3 | 0.5 mm | 269.4 mm | 0 |
| `/POWER_BUTTON` | J22_J2.4 → J20_J1.1 | 0.4 mm | 225.6 mm | 1 |

Holgura de diseño 0,2 mm (0,25–0,3 mm en las de 5V), mínimo 0,62 mm al borde de la placa, nada pasa por el espacio de la Raspberry.

## Comprobaciones hechas
- Estructura del archivo válida, UUID y referencias únicos.
- Las 12 conexiones están conectadas eléctricamente en mi análisis geométrico.
- 3 puntos con holgura exactamente en 0,2 mm (altavoz ±L con GND y `/-AC` con `/HEADPHONE_1_LEFT`): están en el límite, no por debajo.
- No se ejecutó DRC (sin KiCad en mi entorno).

## Sigue yendo por cable (no hay huella de GPIO en la placa)
- Raspberry GPIO ↔ `J20_J5` (I2C `/COMPUTER_SDA`, `/COMPUTER_SCL`, UART, PB0, PB1).
- Salida de audio de la Raspberry → `J_AUDIO_IN`.
- Resto de bornes del J20 (`/PROT`, `/-10V`, `/LINE_SENSE`, `/LPIACT…`) y `/PT` del DC: no hay forma de saber su destino solo por el nombre.

## Antes de fabricar
1. Abre en KiCad, rellena zonas (**B**) y ejecuta DRC.
2. Mide el módulo PAM8403 real y corrige `U_AMP`.
3. Comprueba la corriente de la pista de 5V de la Raspberry (2 mm, ~3–4 A a 10 °C en 1 oz; la Pi 5 puede pedir más) y que el tramo dentro del DC la soporte.
4. Confirma la polaridad de altavoces y que las tierras deben ir unidas.
5. `DC_H1` sigue con su agujero por fuera del borde (pendiente de la v1).


---
## Actualización con la foto de referencia (placa 820-1275-A)

Esa foto es de **otra revisión de placa** (la tuya es 820-1131-A): los zócalos de RAM quedan unos 7 mm desplazados respecto a los orificios, y su regla pegada marca ~6 % menos que el mat y que los zócalos. Por eso la usé solo para **confirmar orificios y bordes**, no como plano.

| Orificio | Resultado |
|---|---|
| J20 H1 (cian, arco izq.) | Es el mismo ZH35 que ya tenía: (89,19; 51,54). Sin cambio. |
| J20 H2 (cian, junto a VGA) | Es el mismo orificio del anillo superior: (154,80; 19,54). Sin cambio. |
| DC H1 (rojo) | Es ZH31. Lo medí **directamente en tu foto**: (266,1; 169,6). DC movida (+0,1; −0,9) mm → centro (261,1; 130,1). |
| J22 H1 (naranja) | **No se puede fijar mejor que ±3 mm** con esa foto. Se mantiene (32,19; 274,74). |

Contorno corregido: borde inferior del cuerpo (~192 mm, antes 189,5), oreja de ZH31 (hasta x 270,5; y 174,5) y fondo de la pestaña (281,5; antes 279,5). Con eso `DC_H1` ya no queda fuera y no hay huellas ni pistas fuera del contorno.
