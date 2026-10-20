# PCB master (KiCad)

| Archivo | Qué es |
|---|---|
| `PCB_imac_unificado_master_v5_con_corte.kicad_pcb` | Versión vigente (QR al repositorio, DRC sin errores, cobre alejado del hueco de la Pi) |
| `PCB_imac_unificado_master_v5.kicad_pcb` | Variante sin el corte (no incluye los cambios recientes) |
| `PCB_imac_unificado_master_v5_placa_vacia.kicad_pcb` | Placa vacía, sin pistas ni huellas |
| `JJaroll.pretty/` + `fp-lib-table` | Biblioteca de huellas del proyecto (15 huellas) |
| `*_gerber.zip`, `*.dxf`, `*.svg`, `vistas_previas/` | Exportaciones (el Gerber y las vistas previas son de una versión anterior: re-exporta desde KiCad) |

## Abrirlo sin avisos de biblioteca
Las huellas del master están en la biblioteca `JJaroll`. Copia `JJaroll.pretty/` y `fp-lib-table` a la carpeta de tu proyecto, junto al `.kicad_pro` (si ya tienes un `fp-lib-table`, añade solo la línea `lib`). También puedes añadirla desde *Preferencias → Gestionar bibliotecas de huellas → Específicas del proyecto*, con la ruta `${KIPRJMOD}/JJaroll.pretty`.

Después de abrir: rellena las zonas (`B`) y ejecuta el DRC.
