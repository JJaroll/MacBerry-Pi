# Informe v3 — PCB único iMac G3 820-1131-A

Archivos:
- `imac_g3_820-1131-A_PCB_unico_v3.kicad_pcb`: hueco como **zona libre** (sin cobre ni componentes), con 4 agujeros M2,5 opcionales.
- `imac_g3_820-1131-A_PCB_unico_v3_con_corte.kicad_pcb`: igual, pero el hueco es un **corte real** en Edge.Cuts (esquinas R3 mm) y sin agujeros M2,5.

La v1 y la v2 quedan intactas (con el contorno anterior).

## Ajuste del contorno con la foto 820-1275-A

Base: foto del Museo de Informática Histórica (1280×854 px, la misma resolución que la anterior; no encontré un original mayor).

- **Método**: segmentación de la placa con umbral adaptativo al fondo, contorno en mm y registro por ICP de semejanza (solo zonas visibles) contra el contorno del modelo. Escala resultante 2,967 px/mm (la regla de la foto da 3,10, un 5 % de error), giro 0,75°, **rms 0,72 mm**.
- **Cambio respecto al contorno anterior**: el anterior ya coincidía dentro de ~0,5–1,2 mm. Diferencia máxima (Hausdorff) 3,1 mm; área +189 mm² / −169 mm² (el área total casi no cambia: 42 658 → 42 678 mm²). Contorno de 126 a 170 vértices.
- **Zonas que se conservaron del modelo anterior** por estar tapadas en la foto: lado izquierdo (bajo el conducto de plástico), esquina y banda derecha del down converter y la ceja del VGA.
- **Limitaciones**: la foto es de la revisión 820-1275-A, no de la 820-1131-A; el orificio J22 H1 sigue con ±3 mm de incertidumbre (la foto lo ubica ~5 mm distinto del objetivo, no lo moví).
- Se rehízo el enrutado completo sobre el contorno nuevo. Nada queda fuera del borde.
- También actualizados: `placa_vacia`, visor 3D (contorno y textura), DXF y SVG (origen en el mínimo del contorno: KiCad x−19,594; y−15,0; capa `AGUJEROS_GUIA` con los 4 tornillos actuales).

## Montaje aplicado (`montaje-pcb.json`)

| Placa | Centro destino (mm) | Giro CCW |
|---|---|---|
| J22 | (38,996; 246,739) | 88,01° |
| J20 | (128,571; 47,833) | 26,2° |
| DC | (261; 131) | 90° |

Los tornillos caen exactamente en sus objetivos: J20 H1 (89,19; 51,54), J20 H2 (154,80; 19,54), J22 H1 (32,19; 274,74) y DC H1 (266,10; 169,60). Ninguna huella ni traza queda fuera del contorno.

## Hueco para la Raspberry y el case

- Case oficial Raspberry Pi 5: **98 × 70 mm** (ficha de Adafruit, producto 5816). Más 2 mm de holgura por lado, el hueco queda de **102 × 74 mm**, centrado en (150; 138).
- Ningún cobre ni componente a menos de 0,6 mm del hueco. El vertido GND lo rodea.
- Si usas otro case o un HAT, cambia `CASE_W`, `CASE_H` y `CASE_CLR` y vuelvo a generar.

## Amplificador (soldadura directa)

`U_AMP` en (73,5; 232), cuadrícula de 2,54 mm. Las medidas salen de la foto: verifica con calibre.

| Pad | Función | Red |
|---|---|---|
| 1 / 2 | L OUT − / + | `/-LEFT_SPEAKER` / `/+LEFT_SPEAKER` |
| 3 / 4 | R OUT + / − | `/+RIGHT_SPEAKER` / `/-RIGHT_SPEAKER` |
| 5 / 6 / 7 | L / ⊥ / R | `/AUDIO_L` / GND / `/AUDIO_R` |
| 8 / 9 | 5V + / − | `/+5V` / GND |

`J_AUDIO_IN` (1×3: L, GND, R) en (65,2; 252,5) recibe el cable del jack del adaptador HDMI→VGA.

## Interfaz con la Raspberry (fuera del hueco, borde superior)

- `J_PI_PWR`: bornero 5,0 mm (+5 V, GND) en (200; 88). Pista de 3 mm en F.Cu y B.Cu en paralelo.
- `J_PI_GPIO`: 1×8 en (164; 93,5) con la fila par del GPIO de la Pi, pines 2 a 16 y misma separación, para un cable 1:1.

| Pin Pi | Red |
|---|---|
| 2, 4 | `/+5V` |
| 6, 14 | GND |
| 8 (TXD) | `/SERIAL_RX` (J20 J5-3) |
| 10 (RXD) | `/PI_RXD`, divisor desde `/SERIAL_TX` (J20 J5-5) |
| 12 | sin conexión |
| 16 (GPIO23) | `/PI_GPIO23_AMBER` (J22 J2-5) |

- Divisor del serial: `R_DIV1` 1 kΩ y `R_DIV2` 2 kΩ, 0805, en (146; 93,5) y (154; 93,5).

## Redes unificadas

- `GNDREF`, `/GND` y `GND` → **GND**. `/PWR_BTN` → `/POWER_BUTTON`.
- `Net-(J2-Pad3)` de J22 → `/LPIACT:L1_LP`, para unirlo al J1-6 de J20.
- `Net-(J2-Pad5)` de J22 → `/PI_GPIO23_AMBER`.

## Pistas añadidas (enrutado automático, 2 capas)

| Red | Conexión | Ancho (mm) | Largo (mm) | Vías |
|---|---|---|---|---|
| `/+5V` | DC J1-5 → J_PI_PWR.1 (F.Cu y B.Cu) | 3,0 | 60 | 0 |
| `/+5V` | DC J1-6 → U_AMP.8 | 1,0 | 256 | 0 |
| `/+5V` | J_PI_PWR.1 → GPIO 2 → GPIO 4 | 1,0 | 40 + 3 | 0 |
| `/+AC` | J22 J2-1 → DC J2-4 | 0,5 | 269 | 1 |
| `/-AC` | J22 J2-2 → DC J2-3 | 0,5 | 275 | 3 |
| `/DCO` | J20 J1-5 → DC J2-1 | 0,5 | 173 | 1 |
| `/POWER_BUTTON` | J22 J2-4 → J20 J1-1 | 0,4 | 224 | 1 |
| `/LPIACT:L1_LP` | J20 J1-6 → J22 J2-3 | 0,4 | 211 | 1 |
| `/PI_GPIO23_AMBER` | J22 J2-5 → GPIO 16 | 0,4 | 266 | 1 |
| Altavoces ×4 | U_AMP 1/2/4/3 → J22 J2-7/8/9/10 | 0,8 | 33 / 32 / 48 / 38 | 1 / 1 / 1 / 4 |
| `/AUDIO_L`, `/AUDIO_R` | U_AMP 5, 7 → J_AUDIO_IN 1, 3 | 0,4 | 10 | 0 |
| `/SERIAL_RX` | J20 J5-3 → GPIO 8 | 0,4 | 44 | 2 |
| `/SERIAL_TX` y `/PI_RXD` | J20 J5-5 → R_DIV1 → GPIO 10 y R_DIV2 | 0,4 | 29 + 30 + 6 | 1 |

GND va por vertido en F.Cu y B.Cu (4 piezas alrededor del hueco, 0,5 mm al borde) más vías de cosido cada 12 mm.

## Comprobaciones hechas (mi propio análisis geométrico)

- Estructura válida, UUID y referencias únicos, paréntesis balanceados.
- 21 de 21 conexiones verificadas pad a pad. 0 cortocircuitos entre redes.
- Holgura mínima de lo nuevo contra otras redes: 0,263 mm (regla de diseño 0,2 mm).
- Distancia mínima de lo nuevo al borde: 0,54 mm (las pistas GND del down converter, anteriores a esta versión, quedan a 0,42 mm).
- Nada de cobre dentro del hueco.
- Continuidad GND: los 250 pads y vías de GND quedan en un solo grupo, suponiendo el relleno de KiCad (modelo aproximado).
- **No se ejecutó DRC ni se abrió en KiCad**: no hay KiCad en mi entorno.

## Sigue yendo por cable

- Raspberry ↔ adaptador HDMI→VGA (micro-HDMI y USB 5 V opcional) y adaptador → `J_AUDIO_IN`.
- Bornes de J20 sin destino en la guía: J1-2 (`/LINE_SENSE`), J1-3 (`/-10V`), J1-4 (`/PROT`). También `/PT` del DC.
- GPIO de la Pi: cable 1:1 desde `J_PI_GPIO` a los pines 2 a 16.
- Ventilador: queda en `DC_M1` del down converter, sin cambios.

## Antes de fabricar

1. Abre en KiCad, rellena zonas (**B**) y ejecuta DRC.
2. Mide el módulo PAM8403 real y corrige `U_AMP`.
3. Confirma el case: con otro modelo o HAT cambia el tamaño del hueco.
4. La pista de 5 V a la Pi admite unos 5 A por capa a 10 °C de subida, en 1 oz. Valida con `vcgencmd get_throttled`.
5. Pendientes de antes: orificio J22 H1 con ±3 mm de incertidumbre, separación de tornillos J20 de 73 mm frente a 70 mm originales, y confirmar la polaridad de los altavoces.
