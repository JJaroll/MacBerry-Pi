# Archivos de fabricación

| Archivo | Contenido |
|---|---|
| `imac_g3_333mhz_slot_loading_J20_adapter_board_es_gerber.zip` | **Listo para fabricar**: Gerbers (F/B Cu, máscara, serigrafía, pasta, Edge.Cuts) y taladros Excellon PTH/NPTH con sus mapas en PDF. Generado desde el `.kicad_pcb` vigente de la carpeta superior, con la serigrafía en español y la firma JJaroll.dev |
| `*-all-pos.csv`, `*.csv` | Posiciones de componentes y BOM |
| `bom/ibom.html` | iBOM original en inglés (el iBOM en español está en la carpeta superior) |

La expansión de máscara es de 0,051 mm por lado, como en el diseño original (`pad_to_mask_clearance` del `.kicad_pcb`). Se aplicó a los Gerbers de máscara con [`utilidades/expandir_mascara.py`](../../../utilidades/expandir_mascara.py) y se comprobó contra los Gerbers originales de qbancoffee. Si exportas desde KiCad con el `.kicad_pcb` de esta carpeta obtienes el mismo resultado.

Revisa el ZIP en la vista previa de tu fabricante antes de pagar. Los Gerbers originales de qbancoffee (serigrafía en inglés) siguen en [`../../../originales/`](../../../originales).
