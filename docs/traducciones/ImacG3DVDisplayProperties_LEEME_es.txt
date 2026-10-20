======================================
DESCRIPCIÓN DE LA SALIDA DE COMPILACIÓN
======================================

Cuando compilas un proyecto de aplicación Java que tiene una clase principal (main), el IDE
copia automáticamente todos los archivos JAR
en el classpath del proyecto a la carpeta dist/lib de tu proyecto. El IDE
también agrega cada uno de los archivos JAR al elemento Class-Path en el archivo
de manifiesto (MANIFEST.MF) del archivo JAR de la aplicación.

Para ejecutar el proyecto desde la línea de comandos, ve a la carpeta dist y
escribe lo siguiente:

java -jar "ImacG3DVDisplayProperties.jar" 

Para distribuir este proyecto, comprime en un archivo ZIP la carpeta dist (incluyendo la carpeta lib)
y distribuye dicho archivo ZIP.

Notas:

* Si dos archivos JAR en el classpath del proyecto tienen el mismo nombre, solo se copia el primer
archivo JAR a la carpeta lib.
* Solo se copian archivos JAR a la carpeta lib.
Si el classpath contiene otros tipos de archivos o carpetas, estos archivos (o carpetas)
no se copian.
* Si una biblioteca en el classpath del proyecto también tiene un elemento Class-Path
especificado en el manifiesto, el contenido del elemento Class-Path debe estar en
la ruta de ejecución (runtime path) del proyecto.
* Para establecer una clase principal en un proyecto Java estándar, haz clic derecho en el nodo del proyecto
en la ventana Proyectos y selecciona Propiedades. Luego haz clic en Ejecutar e ingresa el
nombre de la clase en el campo Clase principal. Alternativamente, puedes escribir manualmente el
nombre de la clase en el elemento Main-Class del manifiesto.
