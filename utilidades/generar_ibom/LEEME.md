# Generador de iBOM en español

Crea el **BOM interactivo** ([InteractiveHtmlBom](https://github.com/openscopeproject/InteractiveHtmlBom)) de las placas del repositorio **sin necesitar KiCad**: lee el `.kicad_pcb` (KiCad 10), construye los datos de la placa (contorno, serigrafía, pads, pistas, vías, zonas y lista de materiales) y los inserta en la plantilla de iBOM.

```bash
pip install HersheyFonts shapely
python3 utilidades/generar_ibom/generar_ibom.py            # las cuatro placas
python3 utilidades/generar_ibom/generar_ibom.py J20 MASTER # solo algunas
```

| Clave | Placa | Salida |
|---|---|---|
| `J20` | J20 · video y ATmega (azul) | `hardware/placas_individuales/J20_video/ibom_es.html` |
| `J22` | J22 · frontal y audio (púrpura) | `hardware/placas_individuales/J22_frontal_audio/ibom_es.html` |
| `DC` | Down Converter (negro) | `hardware/placas_individuales/DownConverter/ibom_es.html` |
| `MASTER` | PCB master v5 (verde) | `hardware/master_pcb/ibom_master.html` |

## Qué hace distinto del plugin original
- **Colores base por placa**: J20 azul, J22 púrpura, Down Converter negro y master verde (se pintan sobre el contorno de `Edge.Cuts`). Se cambian en el diccionario `BOARDS` de `generar_ibom.py`.
- **Interfaz en español** (menús, botones, cabeceras de la tabla y casillas «Comprado» y «Colocado»).
- **Texto de la serigrafía con trazos** (fuente Hershey *futural*), por eso no depende de la fuente de KiCad. Se ve parecido, pero no idéntico, a lo que imprime KiCad.
- Incluye pistas, vías, zonas rellenas y la lista de redes; basta con que el `.kicad_pcb` tenga las zonas rellenadas (`B` en KiCad).

## Archivos
- `kicad2ibom.py`: lector de `.kicad_pcb` y conversor al formato de datos de iBOM (v2.11).
- `generar_ibom.py`: plantilla, colores, traducción y escritura de los HTML.
- `lzstring.py`: compresión LZString en Python puro (la misma que usa iBOM).

La plantilla es el `ibom.html` original del proyecto (`hardware/placas_individuales/J20_video/fabricacion/bom/ibom.html`, iBOM v2.11.2, MIT); no la borres.

## Límites conocidos
- Probado con las cuatro placas de este repositorio (KiCad 10). Otras placas pueden necesitar ajustes (formas de pad raras, justificación vertical de textos, huellas en la cara trasera).
- Las huellas marcadas como *excluir de la BOM* (logos, agujeros de montaje, hueco de la Pi) aparecen dibujadas pero no cuentan en la lista.
