# PCB master (KiCad)

| Archivo | Qué es |
|---|---|
| `PCB_imac_unificado_master_v5_con_corte.kicad_pcb` + `.kicad_pro` | Versión vigente, guardada con KiCad 10 y zonas rellenas (QR al repositorio, cobre alejado del hueco de la Pi). **DRC: 0 violaciones, 0 pads sin conectar** (`DRC_master_v5_con_corte.rpt`) |
| `PCB_imac_unificado_master_v5.kicad_pcb` | Variante sin el corte (no incluye los cambios recientes) |
| `PCB_imac_unificado_master_v5_placa_vacia.kicad_pcb` | Placa vacía, sin pistas ni huellas |
| `JJaroll.pretty/` + `fp-lib-table` | Biblioteca de huellas del proyecto (15 huellas) |
| `PCB_imac_unificado_master_v5_con_corte_gerber.zip` | **Listo para fabricar**: Gerbers (F/B Cu, máscara, serigrafía, pasta, Edge.Cuts) y taladros Excellon PTH/NPTH con sus mapas en PDF. Generado desde la versión vigente |
| `*_contorno_1a1.dxf`, `*.svg` | Contorno 1:1 (el contorno no cambió) |
| `vistas_previas/` | Vistas superior e inferior y detalle de logos, renderizadas desde los Gerbers vigentes |

La placa mide unos 252 × 267 mm, 2 capas, pistas y separación de 0,2 mm, vías 0,6/0,3 mm y taladro mínimo de 0,3 mm. Los Gerbers de la variante sin corte (`PCB_imac_unificado_master_v5.kicad_pcb`) no se incluyen; expórtalos desde KiCad si los necesitas.

## Abrirlo sin avisos de biblioteca
Las huellas del master están en la biblioteca `JJaroll`. Copia `JJaroll.pretty/` y `fp-lib-table` a la carpeta de tu proyecto, junto al `.kicad_pro` (si ya tienes un `fp-lib-table`, añade solo la línea `lib`). También puedes añadirla desde *Preferencias → Gestionar bibliotecas de huellas → Específicas del proyecto*, con la ruta `${KIPRJMOD}/JJaroll.pretty`.

Después de abrir: rellena las zonas (`B`) y ejecuta el DRC.
