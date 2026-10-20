# Informe de fusión — iMac G3 820-1131-A (PCB único)

## Posiciones aplicadas (de tu JSON)

| Placa | Centro destino (mm) | Rotación CCW | Volteada | Tornillos |
|---|---|---|---|---|
| J20 | (128,571; 47,833) | 26,2° | no | H1 y H2 reubicados ±1,499 mm sobre los orificios reales |
| J22 | (38,996; 246,739) | 88,01° | no | H1 sobre el orificio de la pestaña |
| DC | (261; 131) | 90° | no | sin alineación de orificios |

## Referencias renombradas

Todas llevan el prefijo de su placa de origen para evitar duplicados (`J20_U1`, `J22_J1`, `DC_J7`…). Original → nuevo:

- `H1` → `DC_H1`
- `J1` → `DC_J1`
- `J2` → `DC_J2`
- `J7` → `DC_J7`
- `JP1` → `DC_JP1`
- `M1` → `DC_M1`
- `TP1` → `DC_TP1`
- `TP2` → `DC_TP2`
- `C1` → `J20_C1`
- `C2` → `J20_C2`
- `C3` → `J20_C3`
- `D1` → `J20_D1`
- `D2` → `J20_D2`
- `H1` → `J20_H1`
- `H2` → `J20_H2`
- `J1` → `J20_J1`
- `J2` → `J20_J2`
- `J3` → `J20_J3`
- `J4` → `J20_J4`
- `J5` → `J20_J5`
- `JP1` → `J20_JP1`
- `JP2` → `J20_JP2`
- `JP3` → `J20_JP3`
- `R1` → `J20_R1`
- `R2` → `J20_R2`
- `R3` → `J20_R3`
- `R4` → `J20_R4`
- `U1` → `J20_U1`
- `U2` → `J20_U2`
- `Y1` → `J20_Y1`
- `C1` → `J22_C1`
- `H1` → `J22_H1`
- `J1` → `J22_J1`
- `J2` → `J22_J2`
- `J3` → `J22_J3`
- `J4` → `J22_J4`
- `JP1` → `J22_JP1`
- `JP2` → `J22_JP2`
- `JP3` → `J22_JP3`
- `R1` → `J22_R1`
- `R2` → `J22_R2`
- `R3` → `J22_R3`

## Redes

Se conservan los nombres originales. Redes con el mismo nombre en dos placas, que quedan **unidas**: `/DCO` (DC+J20), `/+AC` (DC+J22), `/-AC` (DC+J22).

Redes automáticas `Net-(…)` renombradas con el prefijo de la placa para que no se unan por casualidad (por ejemplo `Net-(C1-Pad2)` existía en J20 y J22): 28.

Las tierras **no** se han unido: `GND` (J20), `GNDREF` (J22) y `/GND` (DC) son tres redes distintas. Decide si deben ser una sola.

## Zonas

Se recortaron al contorno base con 0,5 mm de margen y se quitó el relleno. Pulsa **B** en pcbnew para rellenarlas.

- `J20:GND:F.Cu`: 4127.8 → 3836.6 mm²
- `J20:GND:B.Cu`: 4127.8 → 3836.6 mm²
- `J22:GNDREF:F.Cu`: 1989.7 → 1972.9 mm²
- `J22:GNDREF:B.Cu`: 1989.7 → 1972.9 mm²
- `DC:/GND:F.Cu`: 2752.0 → 2685.1 mm²
- `DC:/GND:B.Cu`: 2752.0 → 2685.1 mm²

## Pendiente de revisar

- `DC_H1` (agujero M3 del down-converter) queda con su centro fuera del contorno base (a 0,38 mm del borde) y 23 segmentos de `/GND` sobresalen alrededor. Hay que desplazar la placa DC unos 3–4 mm hacia el interior.
- Los contornos de los adaptadores se eliminaron; solo rige el contorno base.
- No se ejecutó DRC: no hay KiCad en mi entorno. Ábrelo, rellena zonas (B) y ejecuta DRC.
- El contorno de la pestaña inferior izquierda se completó bajo el disipador (±3 mm).
