# STL del PCB master y de las placas individuales

Generados desde el diseño 1:1 (`hardware/master_pcb/`). Extrusión de 1,6 mm (FR-4), origen en las coordenadas de KiCad con el eje Y invertido (vista superior igual a KiCad). Sin componentes: son para encajar, imprimir una maqueta o importar en CAD.

| Archivo | Contenido |
|---|---|
| `master_v5_con_corte.stl` | Master con el hueco real de la Raspberry Pi 5 + case (102 × 74 mm) y 2 agujeros de base Ø3 |
| `master_v5_sin_corte.stl` | Master con la zona del hueco sin cortar |
| `placa_J22_frontal_audio.stl` | Placa J22 en su bolsillo (giro 90°) |
| `placa_J20_video.stl` | Placa J20 en su bolsillo (giro 26,2°) |
| `placa_DownConverter.stl` | Placa Down Converter en su bolsillo |

Los agujeros de las placas individuales (Ø3,2) coinciden con los tornillos del chasis. Visor: [`../../visores/visor3d_stl.html`](../../visores/visor3d_stl.html).
