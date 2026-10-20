# Master PCB imac unificado · v5

## Concepto
El **master** es la placa grande con la forma de la 820-1131-A. Las 3 placas originales (J22, J20, Down Converter) se atornillan aparte en bolsillos del master. Conservan sus borneras; el master tiene un terminal por cada bornera, con el mismo número de pin, y se unen con cables cortos (≈ 15 mm).

## Cambios respecto a v4
- **Bolsillos** con holgura de 0,3 mm y esquinas de radio 1,0 mm (fresa). J20 y Down Converter quedan abiertos al borde del contorno. **J22 queda abierto hacia la izquierda y abajo.**
- **Borde izquierdo recto**: corte vertical exacto en X = 28,3 mm (de Y ≈ 169,7 a 212,9). Todas las aristas largas H/V del master miden 0,000° / 90,000°.
- **J22 enderezada de 88,01° a 90,00°** (centro sin cambios). Era la causa de la inclinación de 2° en el bolsillo y en la bornera. J20 (26,2°) y Down Converter (90°) no cambian.
- **5 terminales** en el master: `T_J22_J2` (10), `T_J20_J1` (6), `T_J20_J5` (2×3, pin header como el original), `T_DC_J1` (10), `T_DC_J2` (4). Cada uno con serigrafía de número y función por pin.
- `T_DC_J1` pines 5 y 6 (+5 V) unidos con pista de 1 mm.
- Amplificador PAM8403 y `J_AUDIO_IN` reubicados sobre el bolsillo J22 (66,0 ; 201,0) y (79,0 ; 207,0).

## Rutas (20)
189 cm de cobre, 5 vías de cambio de capa. +5 V 3,0/1,0 mm · AC 0,5 mm · control 0,4–0,5 mm · parlantes 0,8 mm · audio y UART 0,4 mm.

## Comprobaciones (análisis geométrico propio)
- 20 de 20 conexiones verificadas pad a pad. 0 cortocircuitos.
- Holgura mínima de lo nuevo contra otras redes: 0,254 mm (regla 0,2 mm).
- Distancia mínima al borde: 0,70 mm. Terminales dentro del master, a ≥ 2,45 mm del borde o bolsillo.
- GND: 156 pads y vías en un solo grupo, 147 vías de cosido cada 12 mm.
- **No se ejecutó DRC ni se abrió en KiCad.**

## Archivos
- `PCB_imac_unificado_master_v5.kicad_pcb` (hueco Pi marcado en silk, con 4 agujeros M2.5 opcionales).
- `PCB_imac_unificado_master_v5_con_corte.kicad_pcb` (hueco Pi recortado; base del Gerber).
- `PCB_imac_unificado_master_v5_placa_vacia.kicad_pcb`: contorno, tornillos y bolsillos.
- `PCB_imac_unificado_master_v5_gerber.zip` + vistas superior/inferior.
- `PCB_imac_unificado_master_v5_contorno_1a1.dxf` / `.svg` (capas: contorno, bolsillos, placas individuales de referencia, tornillos, hueco Pi, pads de terminales).
- Visores en `../visores/` (3D de las PCB y mapa de cableado con y sin master).

## Antes de fabricar
1. Abre en KiCad, rellena zonas y ejecuta DRC.
2. Verifica los terminales contra las borneras reales: la dirección de entrada del cable y el paso (5,00 mm) dependen del modelo exacto.
3. Comprueba que J22 al pasar a 90° sigue alineada con el frontal del iMac (era 88,01° en `montaje-pcb.json`, que no se modificó).
4. Cada placa individual conserva sus tornillos; los bolsillos solo dan holgura y alineación.
5. Mide el módulo PAM8403 real y corrige `U_AMP`.
6. Sigue yendo por cable: Pi ↔ adaptador HDMI→VGA, adaptador → `J_AUDIO_IN`, GPIO restante, y bornes de J20 sin destino.

## Logos en serigrafía (F.SilkS)
Huellas independientes de serigrafía: `LOGO_AVATAR`, `LOGO_LORO`, `LOGO_TEXTO` y `LOGO_QR` (en `PCB_imac_unificado_master_v5_con_corte.kicad_pcb`; el origami se eliminó de esa versión y sigue en `PCB_imac_unificado_master_v5.kicad_pcb`). Para quitar una, selecciónala en KiCad y bórrala.
- **Ilustración** (25,5 × 43,8 mm): tinta en las zonas claras; líneas, pelo y barba quedan sin tinta (verde). Sin el palo inferior.
- **Loro** (21 × 34 mm): trazo mínimo 0,30 mm; el ojo es un punto macizo.
- **Origami** (12,4 mm): icono Lucide.
- **Texto** `jjaroll.dev`: fuente de KiCad, 4 mm, trazo 0,6 mm.
- **QR** al repositorio `https://github.com/JJaroll/MacBerry-Pi` (en mayúsculas, modo alfanumérico, versión 2-M, módulos de 0,8 mm, 24,8 mm con zona de silencio; GitHub no distingue mayúsculas). Se decodificó correctamente desde el render de la serigrafía. Los módulos oscuros son el verde de la máscara y los claros son tinta.
- Se retiraron 22 vías de cosido GND bajo los logos (quedan 125; el GND sigue en un solo grupo).
- Antes de fabricar, confirma con tu fabricante el trazo mínimo de serigrafía (≥ 0,15 mm) y el ancho mínimo de línea.

## DRC (KiCad 10, 2026-10-20)
Reglas: separación mínima 0,127 mm, pista 0,127 mm, borde 0,3 mm, taladro 0,3 mm. Resultado inicial sobre `PCB_imac_unificado_master_v5_con_corte.kicad_pcb`: 0 errores de separación, pista, taladro ni borde; 10 errores y 32 avisos. Corregido en el archivo:
- **8 × `zones_intersect`**: las 4 zonas de GND por capa se solapaban con la misma prioridad. Ahora tienen prioridades 0–3.
- **2 × `unconnected_items`**: los pares `T_DC_J1` 3–4 (+12V) y 7–8 (+3,3V) no estaban unidos entre sí. Se añadió un puente de 1 mm en F.Cu y B.Cu, igual que el de +5V (pads 5–6).

Segunda pasada (0 errores, 34 avisos): se corrigieron los avisos de serigrafía. Se ocultaron las referencias de `H_BASE_A`, `H_BASE_B`, `T_J22_J2` y `J_PI_GPIO`; se quitó el círculo de serigrafía de `H_BASE_A` (cruzaba el borde) y el rectángulo de serigrafía de `PI` (coincidía con el borde del hueco); la leyenda superior de `J_PI_GPIO` baja 1 mm, entre las resistencias y los pines; y la etiqueta `5V + -` de `U_AMP` se redujo a 0,8 mm y se movió dentro del rectángulo.

Avisos que se dejan: huellas `JJaroll:*` fuera de las bibliotecas configuradas, `MountingHole_3.0mm` no encontrada y huellas distintas a la biblioteca estándar. Son 22 avisos de biblioteca que no afectan a la fabricación; se pueden poner en «Ignorar» en *Configuración de la placa → Violaciones del diseño*. Después de abrir el archivo, rellena las zonas (tecla `B`) y vuelve a ejecutar el DRC para confirmar.

## Cobre cerca del hueco de la Pi (2026-10-20)
Distancia del cobre al borde del hueco de 102 × 74 mm: antes, 0,75 mm en 4 pistas (+5V, DCO, GPIO23 y -AC). Se alejaron las pistas `+5V` (lado derecho, a x = 203,5), `PI_GPIO23_AMBER` (lado izquierdo, a x = 96,5) y `-AC` (esquina inferior derecha, incluida su vía) y se movió 1,4 mm la vía de GND de (204, 162) a (205,4, 162). Resultado: todo el cobre queda a ≥ 1,7 mm del hueco, salvo la pista `DCO`, que sigue a 0,75 mm: pasa por un pasillo de 2 mm entre la barra de +5V del header de la Pi (y = 95) y el borde del hueco (y = 97), y no se puede alejar sin mover el header. Se comprobó con un cálculo geométrico propio que los cambios no crean separaciones nuevas menores de 0,3 mm; falta confirmarlo con el DRC de KiCad. Las zonas de GND siguen llegando a 0,3 mm del borde (el valor de «Margen de cobre a borde»).

## Biblioteca de huellas
Las 14 huellas de la placa se pasaron a una biblioteca propia, `JJaroll.pretty/` (con su `fp-lib-table`), para eliminar los avisos `lib_footprint_issues` y `lib_footprint_mismatch` del DRC (17 de los 18 que quedaban). Ver `hardware/master_pcb/LEEME.md`.
