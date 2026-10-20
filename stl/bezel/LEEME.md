# Bisel interior imprimible en 3D (iMac G3 slot-loading)

> ⚠️ **Licencia distinta al resto del repositorio.** Estos STL **no** son LGPL-3.0: son
> **CC BY-NC 4.0** (atribución, **uso no comercial**). Ver [`LICENSE_CC-BY-NC-4.0.md`](LICENSE_CC-BY-NC-4.0.md).

## Autoría

- **Diseño del bisel y STL:** [Anthony Bernaert](https://github.com/anthony-bernaert) — repositorio original
  [`anthony-bernaert/imac-g3-screen-bezel`](https://github.com/anthony-bernaert/imac-g3-screen-bezel) (release `v0.1-beta.1`).
- **Escaneo 3D del bisel original (referencia):** [Nicolas Robin](https://github.com/nicolas-robin), compartido con su permiso.
- Los archivos se incluyen **sin modificar**. Los fuentes de Fusion (`Bezel.f3d`, `Bezel_with_Supports.f3d`) y el escaneo
  (25 MB) **no** se copian aquí: están en el repositorio original.
- Si quieres usar estos STL con fines comerciales, contacta con el autor original.

## Piezas

| Archivo | Cant. | Notas |
|---|---|---|
| `Top_Left`, `Top_Right`, `Bottom_Left`, `Bottom_Right` | 4 | Cuadrantes del bisel |
| `*_Supported` (4 variantes) | — | Mismos cuadrantes con soportes personalizados en zonas críticas |
| `Dowel_Top`, `Dowel_Bottom`, `Dowel_Left`, `Dowel_Right` | 4 | Pasadores de unión |
| `Power_Button` | 1 | Resorte impreso integrado (no requiere el original) |
| `Screw_Cover_Top_Left/Top_Right/Bottom_Left/Bottom_Right` | 4 | Tapas de tornillo |

Se imprime con `Top_*`/`Bottom_*` **o** con sus variantes `_Supported`, no con ambas.

## Resumen de impresión (según el autor)

- **ABS, ASA o similar. No imprimir en PLA** (el iMac se calienta). PETG podría bastar, sin garantía.
- Cama mínima recomendada: 200 × 200 mm. Imprimir los cuadrantes inclinados para mejor acabado.
- Ajustes usados: capa 0,2 mm · gyroid 15 % · 3 perímetros · generador de paredes Arachne.
- Compensa la contracción del filamento (el autor escala a 100,5 % con ASA).
- Unión de piezas: soldadura con acetona (o adhesivo); lija ligera para igualar caras.
- Pegar el botón de encendido en su posición.

## ⚠️ Seguridad

El CRT pesa ~8 kg y es un tubo de vacío frágil, y **puede conservar 20–30 kV tras apagarlo**: requiere un procedimiento de
descarga correcto antes de manipularlo. Úsalo bajo tu propia responsabilidad.

## Visor

[`../../visores/visor_inner_bezel.html`](../../visores/visor_inner_bezel.html) muestra estas piezas en 3D (ensamblaje, vista explosionada, orden de montaje, cotas, medidas y versión con soportes). Es un solo HTML con los STL incrustados: se abre con doble clic, sin internet ni servidor.
