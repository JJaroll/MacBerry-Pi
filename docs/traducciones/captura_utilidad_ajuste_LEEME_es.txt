Esta captura se realizó ejecutando la utilidad de ajuste de pantalla de Apple
bajo System 9. Las líneas I2C de IVAD fueron monitorizadas externamente
con una computadora Ubuntu 16.04 usando un analizador lógico Saleae.

Cada propiedad se registró deslizando la barra de mínimo a máximo.
Las capturas contienen la dirección IVAD 0x46 y el desplazamiento de registro
para cada propiedad, junto con el valor enviado para dicha propiedad.

Cada propiedad se encuentra en un archivo CSV nombrado según el nombre en el
programa.

Por ejemplo, cuando manipulé la propiedad "width" (ancho) y la capturé,
llamé a ese archivo "width.csv".
