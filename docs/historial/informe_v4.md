# PCB imac unificado · v4

## Qué cambió respecto a v3

- **Contorno limpio**: domo = un solo círculo (R 124,5 mm), tramos rectos horizontales/verticales, tangente izquierda con filete R100 y esquinas redondeadas (R3 convexo, R2 cóncavo). Sin los entrantes de la izquierda. Ajustado a la foto 820-1275-A.
- **2 tornillos a la base** (M3, NPTH 3,0 mm): `H_BASE_A` (277,57 ; 72,64) y `H_BASE_B` (125,59 ; 175,17). Posición medida en la foto, ±1 mm. `H_BASE_A` queda a 2,6 mm del borde.
- **Sin borneras de interconexión**: se eliminan `J22_J2`, `J20_J1`, `J20_J5` y `DC_J2`. Sus posiciones quedan como vías-nodo de 1,0/0,5 mm; las no usadas sirven de puntos de prueba.
- **Se conserva** `DC_J1` (bornera del Down Converter) para sacar tensión a otros usos.
- Hueco de la Pi 5 subido 4 mm (centro y = 134) para no chocar con el tornillo B.
- La Pi se alimenta por GPIO pines 2 y 4 (se elimina `J_PI_PWR`). Cabecera GPIO espejada y divisor R_DIV1/R_DIV2 reubicado.

## Rutas internas (20)

| Grupo | Rutas | Ancho |
|---|---|---|
| +5 V | DC·J1 pin 5 → GPIO pin 2 (F.Cu y B.Cu en paralelo), puente GPIO 2→4, DC·J1 pin 6 → amplificador | 3,0 / 1,0 mm |
| AC | +AC y −AC: frontal → DC·J2 pines 4 y 3 | 0,5 mm |
| Control | DCO, botón de encendido, LED actividad, LED ámbar (GPIO23) | 0,4–0,5 mm |
| Audio | 4 parlantes (0,8 mm), audio L/R (0,4 mm) | 0,4–0,8 mm |
| UART | SERIAL_RX, SERIAL_TX, divisor a PI_RXD | 0,4 mm |

Total ≈ 210 cm de cobre nuevo, 13 vías de cambio de capa.

## Comprobaciones (análisis geométrico propio)

- 20 de 20 conexiones verificadas pad a pad. 0 cortocircuitos.
- Holgura mínima de lo nuevo contra otras redes: 0,217 mm (regla 0,2 mm).
- Distancia mínima al borde: 0,50 mm. Nada de cobre dentro del hueco.
- Distancia mínima de lo nuevo a agujeros NPTH: 1,755 mm.
- GND: 265 pads y vías en un solo grupo, con 192 vías de unión cada 12 mm (suponiendo relleno de KiCad).
- **No se ejecutó DRC ni se abrió en KiCad.**

## Archivos

- `PCB_imac_unificado_v4.kicad_pcb`: variante A (hueco marcado en silk).
- `PCB_imac_unificado_v4_con_corte.kicad_pcb`: variante B (hueco recortado en Edge.Cuts).
- `PCB_imac_unificado_placa_vacia.kicad_pcb`: solo contorno, tornillos y hueco.
- `PCB_imac_unificado_contorno_1a1.dxf` / `.svg`: contorno 1:1 con capas `CONTORNO`, `AGUJEROS_GUIA`, `TORNILLOS_BASE`, `HUECO_PI`.
- Vistas previas PNG de A y B.
- Artefactos: visor 3D con todo ensamblado y mapa de cableado interno.

## Antes de fabricar

1. Abre en KiCad, rellena zonas (**B**) y ejecuta DRC.
2. Verifica los 2 tornillos contra la base real (±1 mm; la foto es la revisión 820-1275-A).
3. La Pi 5 pide 5 V / 5 A: alimentarla por GPIO hace que avise de `PSU_MAX_CURRENT`; configura `usb_max_current_enable=1` o valida con `vcgencmd get_throttled`. Cada troncal de 3 mm admite ≈ 5 A por capa (IPC-2221, 1 oz, ΔT 10 °C).
4. Mide el módulo PAM8403 real y corrige `U_AMP`.
5. Alturas del modelo 3D aproximadas (huellas de KiCad); case oficial 31 mm.
6. Sigue yendo por cable: Pi ↔ adaptador HDMI→VGA, adaptador → `J_AUDIO_IN`, GPIO restante 1:1, y bornes de J20 sin destino (`/LINE_SENSE`, `/-10V`, `/PROT`, `/PT`).
