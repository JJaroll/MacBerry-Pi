/* MacBerry Pi G3 · fases y pasos de la guía.
   Bloques: p, aviso{n:peligro|aviso|consejo|info}, lista, num, img, imgs, cod, chk, tabla, w (widget), enlaces, ok (cómo sabes que salió bien), fallo (si no sale). */
window.MB = window.MB || {};
const IM = "originales/imagenes/";

MB.FASES = [
/* ======================= 0 ======================= */
{ id: 0, ico: "0", t: "Preparación", r: "Qué vas a construir, seguridad, tu plan y la lista de compras.", pasos: [
  { id: "0.1", t: "Qué vas a construir", b: [
    { t: "p", x: "Vas a convertir un **iMac G3 slot loading** en un equipo moderno: una **Raspberry Pi 5** dentro de la carcasa que usa el **tubo CRT original como monitor VGA**, con sus altavoces y su botón de encendido. No se corta nada del iMac: es reversible." },
    { t: "w", w: "diagrama" },
    { t: "p", x: "El truco es que la placa de video del tubo ([[IVAD]]) solo funciona si cree que sigue conectada a la placa lógica de Apple. Tres placas adaptadoras hacen ese trabajo:" },
    { t: "lista", i: ["**Placa J20** · el cerebro: un ATmega inicializa el IVAD por I²C, lee el botón, enciende la CRT con un relé y recibe el VGA.", "**Placa J22** · panel frontal: botón, LEDs, parlantes, audífonos, micrófono y los 24 VAC.", "**Placa Down Converter** · breakout de la fuente original (PAV): entrega +3,3, +5 y +12 V en borneras."] },
    { t: "img", s: MB.img("imac_g3_adapter_boards.png"), a: "Renderizado de las tres placas adaptadoras", p: "Las tres placas adaptadoras (renderizado KiCad del proyecto original)." },
    { t: "aviso", n: "info", x: "Las fotos de montajes reales que verás en esta guía son del **proyecto original** (qbancoffee / Rocky Hill). Las placas de este repositorio son las mismas, con serigrafía en español." },
    { t: "p", x: "Este proyecto es para iMac G3 **slot loading** (350–700 MHz). No se ha comprobado con otros modelos." }
  ] },
  { id: "0.2", t: "Seguridad: léelo antes de tocar nada", b: [
    { t: "aviso", n: "peligro", x: "**Alto voltaje.** El tubo CRT y la placa analógica pueden guardar hasta unos 25 000 V en el ánodo y en los condensadores, **incluso con el iMac desenchufado durante días**. Descarga siempre el tubo con una sonda a tierra antes de meter las manos. Si no sabes hacerlo con seguridad, busca a un técnico." },
    { t: "aviso", n: "aviso", x: "**Plásticos frágiles.** El bisel interior de un iMac G3 tiene más de 20 años y se rompe con una mínima torsión. Desmonta con suavidad y sigue el [manual de servicio de Apple](https://www.ifixit.com/Document/OBF5tQG3oqWwfuaX/G3-Disassembly.pdf)." },
    { t: "aviso", n: "aviso", x: "**Estática ([[ESD]]).** Tus manos pueden destruir el ATmega y otros chips. Trabaja sobre una superficie antiestática y con pulsera a tierra." },
    { t: "aviso", n: "peligro", x: "**Con la CRT encendida** hay miles de voltios en el flyback y en el cable que va al tubo. No los toques nunca." },
    { t: "chk", id: "seg", tit: "Confirma antes de seguir", i: [["seg1", "Entiendo que el CRT guarda carga aunque esté desenchufado y que debo descargarlo antes de manipularlo."], ["seg2", "Tengo pulsera antiestática y una superficie de trabajo antiestática."], ["seg3", "Trabajaré con una sola mano cerca de la placa analógica."], ["seg4", "Voy a seguir el manual de servicio de Apple para desmontar, sin forzar los plásticos."], ["seg5", "Asumo el riesgo: lo hago bajo mi propia responsabilidad."]] }
  ] },
  { id: "0.3", t: "Cuéntanos tu montaje", b: [
    { t: "p", x: "Responde unas preguntas y la guía se adapta: oculta los pasos que no necesitas y muestra solo los cables de tu montaje. Puedes cambiar tus respuestas cuando quieras." },
    { t: "w", w: "plan" }
  ] },
  { id: "0.4", t: "Lista de compras y herramientas", b: [
    { t: "p", x: "Esta lista se arma según tu plan. Marca lo que ya tienes." },
    { t: "w", w: "compras" },
    { t: "aviso", n: "consejo", x: "Antes de pedir, abre el **iBOM** de cada placa (en «Descargas») y revisa las referencias. Los CSV de Digi-Key del repositorio tienen precios y existencias de 2020." }
  ] },
  { id: "0.5", t: "Estado del proyecto (lo que está probado y lo que no)", b: [
    { t: "tabla", c: ["Elemento", "Estado"], f: [
      ["Placas J20, J22 y Down Converter del proyecto original", "Diseñadas y probadas por su autor (qbancoffee); hay vídeos de montajes funcionando."],
      ["Versión en español de las 3 placas (este repositorio)", "DRC de KiCad sin errores y Gerber generado. Todavía **no fabricadas ni probadas** por JJaroll."],
      ["Pines y cableado con la Pi 5", "Verificados contra los archivos KiCad y las netlists. Pendientes de prueba física completa."],
      ["PCB master v5", "DRC con 0 violaciones, pistas comprobadas pad a pad. **Sin fabricar ni verificar en hardware.**"],
      ["Bisel interior imprimible", "Diseño de Anthony Bernaert (versión beta). Licencia CC BY-NC 4.0."]
    ] },
    { t: "aviso", n: "info", x: "Si fabricas algo y encuentras un error, abre un *issue* en el [repositorio](https://github.com/JJaroll/MacBerry-Pi/issues): así mejora la guía para todos." }
  ] }
] },

/* ======================= 1 ======================= */
{ id: 1, ico: "1", t: "Abrir el iMac y exponer los conectores", r: "Desmontar, descargar el CRT, retirar la placa lógica y reconocer J20, J22 y J7.", pasos: [
  { id: "1.1", t: "Prepara la mesa", b: [
    { t: "lista", i: ["Superficie plana, bien iluminada y antiestática.", "Pulsera antiestática conectada a tierra.", "Un recipiente para los tornillos, y una foto de cada paso antes de desconectar nada.", "El iMac **desenchufado**."] },
    { t: "aviso", n: "consejo", x: "Fotografía cada conector antes de desenchufarlo. Mucha gente se pierde al volver a armar, no al desmontar." }
  ] },
  { id: "1.2", t: "Abre la carcasa", b: [
    { t: "p", x: "Sigue el **manual de servicio de Apple** («Take Apart») para retirar la carcasa y dejar la placa lógica accesible. Esta guía no lo reemplaza: cada paso del manual tiene sus precauciones." },
    { t: "enlaces", i: [["Manual de servicio de Apple: iMac DV, DV+ y DV SE (iFixit)", "https://www.ifixit.com/Document/OBF5tQG3oqWwfuaX/G3-Disassembly.pdf", "El procedimiento oficial de desarmado. iFixit puede pedirte iniciar sesión (es gratis) para ver todas las páginas."], ["Wiki del proyecto original: convertir el iMac en un monitor VGA", "https://github.com/qbancoffee/imac_g3_ivad_board_init/wiki/Convert-and-iMac-G3-slot-loader-into-a-standard-VGA-monitor", "En inglés. Explica el desarmado y la lógica del proyecto."]] },
    { t: "aviso", n: "aviso", x: "No fuerces ningún plástico. Si algo no sale, revisa si hay un tornillo o un clip antes de aplicar más fuerza." }
  ] },
  { id: "1.3", t: "Descarga el CRT", b: [
    { t: "aviso", n: "peligro", x: "**Este es el paso más peligroso de todo el proyecto.** Si no estás seguro, para aquí y pide ayuda a un técnico." },
    { t: "img", s: MB.img("analog_board.jpg"), a: "Parte superior del iMac con la placa analógica y la placa IVAD", p: "La placa analógica (debajo del tubo), la placa IVAD (en el cuello) y la entrada de red. Foto del proyecto original." },
    { t: "num", i: ["Con el iMac desenchufado, conecta el cable de tierra de una **sonda de descarga** (con mango aislado) al chasis metálico.", "Con **una sola mano**, desliza la punta de la sonda bajo la goma del ánodo del tubo y mantén el contacto hasta oír el chasquido de la descarga.", "Repite varias veces. No te fíes de «lleva días apagado»."] },
    { t: "chk", id: "descarga", tit: "Descarga del CRT", i: [["des1", "Descargué el tubo con una sonda a tierra, con una sola mano."], ["des2", "Repetí la descarga varias veces."], ["des3", "No toqué el ánodo ni el flyback con las manos."]] }
  ] },
  { id: "1.4", t: "Retira la placa lógica", b: [
    { t: "p", x: "Los conectores del chasis están debajo de la placa lógica. Hay que sacarla para llegar a ellos. El iMac apoyado sobre un costado deja ver la parte inferior:" },
    { t: "img", s: MB.img("chassis.jpg"), a: "Chasis con la placa lógica retirada", p: "Parte inferior del iMac apoyado de lado: aquí se acoplan la placa lógica y la placa down converter. En la foto ya se retiraron. Se ven los conectores J22 y J20." },
    { t: "p", x: "La placa PAV (down converter) va acoplada a la placa lógica. Según el manual de Apple:" },
    { t: "img", s: MB.img("removing_down_converter_board.png"), a: "Paso 6 del manual de Apple: separar la placa down converter", p: "Manual de Apple, paso 6: «Sujetando las placas, presiona el conector negro y separa la placa down converter de la placa lógica»." },
    { t: "aviso", n: "consejo", x: "Nota del manual al volver a montar la placa lógica: asegúrate de que el **cable de la antena no quede debajo** de la placa." },
    { t: "img", s: MB.img("logic_board_and_downconverter_board.jpg"), a: "Enrutamiento de energía entre la placa analógica, la placa lógica y la down converter", p: "Cómo viaja la energía: 48 VAC desde la placa analógica, 5 V trickle por J20, y los rieles 3,3 / 5 / 12 V desde la down converter." }
  ] },
  { id: "1.5", t: "Reconoce J20, J22 y J7", b: [
    { t: "p", x: "Al retirar la placa lógica quedan a la vista estos conectores:" },
    { t: "tabla", c: ["Conector", "Pines", "Qué lleva"], f: [["J20", "20", "I²C del IVAD, video analógico RGB y sincronismos, 5 V trickle y señales de encendido"], ["J22", "26", "Botón, LEDs, parlantes, audífonos, micrófono y 24 VAC"], ["J7 (placa PAV)", "24", "Entrada de 24 VAC y salida de los rieles de la placa madre"]] },
    { t: "img", s: MB.img("connectors_and_boards.png"), a: "Diagrama de pines de J20 y J22 y su ubicación en el chasis", p: "Los conectores J20 y J22, mirados desde la parte inferior del equipo (diagrama del proyecto original)." },
    { t: "img", s: MB.img("imac_g3_slot_loading_pav_board.png"), a: "Conector J7 de la placa PAV y su relación con J22 y J20", p: "La placa PAV y su conector J7. Dos numeraciones: la Molex del esquemático (verde) y la de LG/Apple (negro)." },
    { t: "aviso", n: "aviso", x: "**Usa las tablas de «Pines» de este sitio**, verificadas contra KiCad. Las tablas de otras guías (incluida la primera versión traducida) pueden diferir: en J20 el RGB va en 17/15/13 y la sincronía en 9/11; en J22 los 24 VAC están en 23–26 y el botón en 17." },
    { t: "chk", id: "conect", tit: "Reconocimiento", i: [["con1", "Identifiqué los conectores J20 (20 pines) y J22 (26 pines) en el chasis."], ["con2", "Identifiqué el conector J7 de la placa PAV."], ["con3", "Sé dónde está el pin 1 de cada uno (anota o fotografía)."]] }
  ] },
  { id: "1.6", t: "Opcional: probar la CRT sin ninguna placa", b: [
    { t: "p", x: "Antes de gastar en placas puedes comprobar que tu CRT sirve. El método original usa un cable y una secuencia de inicialización:" },
    { t: "img", s: MB.img("crt_power_on_and_off.png"), a: "Encendido y apagado de la CRT en J20", p: "Encender: unir con un cable los pines 6, 10 y 12 de J20 y enviar la inicialización. Apagar: desconectar el pin 6 (5 V trickle)." },
    { t: "aviso", n: "peligro", x: "Con la CRT encendida hay **miles de voltios** en el flyback. No toques el tubo ni el cable que va hacia él." },
    { t: "p", x: "La inicialización la puede enviar un Arduino o una Raspberry Pi (ver «Extras → Camino sin PCBs»). Si no quieres complicarte, salta este paso: la placa J20 hará todo esto sola." }
  ] }
] },

/* ======================= 2 ======================= */
{ id: 2, ico: "2", t: "Pedir las placas", r: "Descargar los Gerber, fabricar y pedir los componentes.", pasos: [
  { id: "2.1", t: "Qué archivos necesitas", b: [
    { t: "p", x: "Cada placa se pide como un archivo **ZIP de Gerber**. Ya está listo en el repositorio: 9 capas `.gbr`, 2 taladros `.drl` y 2 mapas de taladros en PDF." },
    { t: "w", w: "dl_placas" },
    { t: "tabla", c: ["Placa", "Tamaño", "Capas", "Detalles"], f: [["J20", "82,5 × 52,5 mm", "2", "FR-4 1,6 mm · pistas 0,2 mm · taladro mín. 0,3 mm"], ["J22", "65 × 30 mm", "2", "igual"], ["Down Converter", "88 × 39 mm", "2", "igual"], ["Master (si lo usas)", "≈252 × 267 mm", "2", "igual · hueco para la Pi de 102 × 74 mm"]] },
    { t: "img", s: "sitio/img/placa_j20_sup.png", a: "Vista de los Gerber de la placa J20, cara superior", p: "Placa J20, cara superior (renderizada desde los Gerber del repositorio)." }
  ] },
  { id: "2.2", t: "Haz el pedido", b: [
    { t: "num", i: ["Entra a tu fabricante de PCB (el autor original usa JLCPCB; vale cualquiera que acepte Gerber).", "Sube el ZIP de **cada placa** por separado.", "Revisa la vista previa del fabricante: contorno, taladros y serigrafía deben coincidir con las imágenes de este sitio.", "Elige 2 capas, FR-4 y 1,6 mm de grosor. El resto de opciones (acabado, color) no afecta al diseño.", "Pide al menos la cantidad mínima: suelen sobrar placas para repuesto."] },
    { t: "aviso", n: "info", x: "Los Gerber de las tres placas individuales ya incluyen la expansión de máscara de soldadura (+0,051 mm) del diseño original. No hace falta que la cambies." },
    { t: "imgs", i: [["sitio/img/placa_j20_inf.png", "Placa J20, cara inferior (headers J2 y jumpers)"], ["sitio/img/placa_j22_sup.png", "Placa J22, cara superior"], ["sitio/img/placa_dc_sup.png", "Placa Down Converter, cara superior"]] }
  ] },
  { id: "2.3", t: "Si usas el PCB master: revisa antes de pagar", si: { ruta: "master" }, b: [
    { t: "aviso", n: "aviso", x: "El master **no está fabricado ni probado** en hardware. Haz estas comprobaciones antes de pedirlo." },
    { t: "w", w: "dl_master" },
    { t: "img", s: "hardware/master_pcb/vistas_previas/PCB_imac_unificado_master_v5_gerber_vista_superior.png", a: "Vista superior del master", p: "Master v5, cara superior." },
    { t: "chk", id: "masterfab", tit: "Antes de fabricar el master", i: [["mf1", "Subí el ZIP a mi fabricante y revisé su vista previa antes de pagar."], ["mf2", "Verifiqué los terminales contra mis borneras reales (paso 5,00 mm y dirección de entrada del cable)."], ["mf3", "Comprobé que la J22 (que en el master pasó a 90,00°) sigue alineada con el frontal del iMac."], ["mf4", "Medí mi módulo PAM8403 real (el diseño asume 19,05 × 22,86 mm con pines 2,54 mm)."], ["mf5", "Confirmé con el fabricante el trazo mínimo de serigrafía (≥ 0,15 mm) y el límite de tamaño (≈252 × 267 mm)."]] },
    { t: "aviso", n: "info", x: "El master sigue necesitando cables: Pi ↔ adaptador HDMI→VGA, adaptador → `J_AUDIO_IN`, GPIO de la Pi y los bornes de la J20 sin destino." }
  ] },
  { id: "2.4", t: "Pide los componentes", b: [
    { t: "p", x: "Usa la lista de compras de la fase 0 (se adapta a tu plan) y el iBOM de cada placa." },
    { t: "w", w: "compras" },
    { t: "aviso", n: "consejo", x: "Pide zócalos para el ATmega y el relé LCC110: te permiten sacar el chip para programarlo (método 1 de la fase 5) y reemplazarlo sin soldar." }
  ] },
  { id: "2.5", t: "Mientras esperas", b: [
    { t: "lista", i: ["Imprime el bisel interior (fase 3).", "Programa el ATmega en un Arduino Uno (fase 5, método 1).", "Prepara la microSD de la Pi (fase 9).", "Prueba la CRT sin placas (paso 1.6) y practica la descarga con calma."] }
  ] }
] },

/* ======================= 3 ======================= */
{ id: 3, ico: "3", t: "Imprimir el bisel interior", r: "Piezas, material, ajustes y unión del bisel imprimible.", si: { bezel: "imprimir" }, pasos: [
  { id: "3.1", t: "Licencia y piezas", b: [
    { t: "aviso", n: "aviso", x: "El bisel es de **Anthony Bernaert** y tiene licencia **CC BY-NC 4.0**: atribución y **solo uso no comercial**. El resto del repositorio es LGPL-3.0." },
    { t: "tabla", c: ["Archivo", "Cantidad", "Notas"], f: [["Top_Left, Top_Right, Bottom_Left, Bottom_Right", "4", "Cuadrantes del bisel"], ["Variantes *_Supported", "—", "Mismos cuadrantes con soportes en zonas críticas"], ["Dowel_Top/Bottom/Left/Right", "4", "Pasadores de unión"], ["Power_Button", "1", "Resorte impreso integrado: no necesitas el original"], ["Screw_Cover_* (4)", "4", "Tapas de tornillo"]] },
    { t: "aviso", n: "info", x: "Imprime los cuadrantes estándar **o** los `_Supported`, **no ambos**." },
    { t: "enlaces", i: [["Visor del bisel interior (3D)", "visores/visor_inner_bezel.html", "17 piezas, ensamblaje, vista explosionada, orden de montaje y cotas. Pesa ~8,5 MB."], ["Descargar los STL", "#/t/descargas", "Sección «Bisel interior» de Descargas."]] }
  ] },
  { id: "3.2", t: "Material y ajustes", b: [
    { t: "aviso", n: "peligro", x: "**No imprimas en PLA**: el iMac se calienta y se deformaría. Usa **ABS o ASA**. PETG podría bastar, sin garantía." },
    { t: "tabla", c: ["Ajuste", "Valor (según el autor)"], f: [["Material", "ABS, ASA o similar"], ["Altura de capa", "0,2 mm"], ["Relleno", "Gyroid 15 %"], ["Perímetros", "3"], ["Generador de paredes", "Arachne"], ["Escala", "100,5 % con ASA (compensa la contracción)"], ["Cama mínima", "200 × 200 mm"], ["Orientación", "Cuadrantes inclinados, para mejor acabado"]] }
  ] },
  { id: "3.3", t: "Une las piezas", b: [
    { t: "num", i: ["Lija ligeramente las caras de unión para igualarlas.", "Suelda las piezas con **acetona** (o con un adhesivo adecuado) ayudándote de los pasadores.", "Pega el botón de encendido en su posición.", "Deja curar bien antes de manipular."] },
    { t: "aviso", n: "aviso", x: "Trabaja con la acetona en un lugar ventilado y lejos de llamas." },
    { t: "chk", id: "bezel", tit: "Bisel listo", i: [["bz1", "Impresas las 4 piezas del bisel (estándar o con soportes)."], ["bz2", "Pasadores, botón y tapas de tornillo impresos."], ["bz3", "Piezas unidas y curadas."]] }
  ] }
] },

/* ======================= 4 ======================= */
{ id: 4, ico: "4", t: "Soldar las placas", r: "Montaje de componentes y jumpers en J20, J22, Down Converter (y master).", pasos: [
  { id: "4.1", t: "Reglas generales", b: [
    { t: "lista", i: ["Orden clásico: componentes bajos primero (resistencias, diodos), luego zócalos, condensadores, cristal, headers y por último conectores y borneras.", "Los **headers de enchufe al arnés** (J2 en la J20, J1 en la J22) se sueldan por la **cara inferior**.", "Respeta la polaridad: condensador electrolítico, diodos (banda) y muesca de los chips.", "Abre el **iBOM** de la placa: te muestra dónde va cada componente y puedes ir marcando lo soldado."] },
    { t: "w", w: "ibom_links" },
    { t: "aviso", n: "consejo", x: "Usa zócalos para el ATmega328P y el relé LCC110. No metas los chips hasta terminar y revisar las soldaduras." },
    { t: "w", w: "visor3d_link" }
  ] },
  { id: "4.2", t: "Placa J20 (video y cerebro)", b: [
    { t: "imgs", i: [["sitio/img/placa_j20_sup.png", "Cara superior de la J20"], ["sitio/img/placa_j20_inf.png", "Cara inferior de la J20: header J2 y jumpers"]] },
    { t: "tabla", c: ["Ref.", "Componente"], f: [["R1, R2, R3", "10 kΩ"], ["R4", "220 Ω"], ["D1, D2", "1N5819 Schottky"], ["U1", "ATmega328P-PU (DIP-28) en zócalo"], ["U2", "Relé LCC110 (DIP-8) en zócalo"], ["C1, C2", "22 pF"], ["Y1", "Cristal 16 MHz HC49"], ["C3", "470 µF electrolítico"], ["J1", "Bornera de 6"], ["J3, J5", "Headers 2×3"], ["J4", "DB15 HD hembra, ángulo recto"], ["J2", "Header 2×10 (TSW-110-23-G-D), **cara inferior**"]] },
    { t: "img", s: MB.img("J20_board_installed.jpg"), a: "Placa J20 instalada en el chasis", p: "Una placa J20 instalada en el chasis (proyecto original, Rev 2)." },
    { t: "p", x: "**Jumpers de la J20:** suelda JP1 y JP2 (EDID) y **JP3 (obligatorio)**. Te los explico con dibujos aquí:" },
    { t: "w", w: "jumpers", f: "J20" },
    { t: "chk", id: "j20s", tit: "J20 soldada", i: [["j20a", "Resistencias y diodos soldados (banda del diodo según la serigrafía)."], ["j20b", "Zócalos, condensadores y cristal soldados; C3 con la polaridad correcta."], ["j20c", "Bornera J1, headers J3 y J5 y el DB15 (J4) soldados."], ["j20d", "Header J2 soldado por la cara inferior."], ["j20e", "JP3 soldado (y JP1/JP2 si quieres EDID)."], ["j20f", "Revisé puentes de estaño y no hay corto entre +5 V y GND."]] }
  ] },
  { id: "4.3", t: "Placa J22 (frontal y audio)", b: [
    { t: "imgs", i: [["sitio/img/placa_j22_sup.png", "Cara superior de la J22"], ["sitio/img/placa_j22_inf.png", "Cara inferior de la J22: header J1 y jumpers del micrófono"]] },
    { t: "tabla", c: ["Ref.", "Componente"], f: [["R1, R2", "220 Ω (limitan los LEDs)"], ["J4", "Header 2×3 (audífonos)"], ["J2", "Bornera de 10"], ["J1", "Header 2×13 (929665-02-13-I), **cara inferior**"], ["C1, R3, J3, micrófono", "1 µF, 2,2 kΩ, jack 3,5 mm y electret AOM-5024L-HD-R: **solo con micrófono**"]] },
    { t: "img", s: MB.img("J22_board_installed.jpg"), a: "Placa J22 instalada", p: "Placa J22 instalada (proyecto original)." },
    { t: "w", w: "jumpers", f: "J22" },
    { t: "chk", id: "j22s", tit: "J22 soldada", i: [["j22a", "Resistencias, headers y bornera soldados."], ["j22b", "Header J1 soldado por la cara inferior."], ["j22c", "Micrófono y jumpers según tu plan (o sin montar)."], ["j22d", "Sin puentes de estaño ni cortos."]] }
  ] },
  { id: "4.4", t: "Placa Down Converter", b: [
    { t: "imgs", i: [["sitio/img/placa_dc_sup.png", "Cara superior del Down Converter"], ["sitio/img/placa_dc_inf.png", "Cara inferior del Down Converter"]] },
    { t: "tabla", c: ["Ref.", "Componente"], f: [["J7", "Molex Micro-Fit 43045-2400, 24 pines, ángulo recto (header de PCB)"], ["J1", "Bornera de 10"], ["J2", "Bornera de 4"], ["M1", "Header de 4 pines para ventilador (opcional)"]] },
    { t: "img", s: MB.img("down_converter_breakout_board.jpg"), a: "Placa down converter breakout", p: "La placa breakout real (proyecto original). Las borneras verdes de la izquierda y arriba son J2 y J1." },
    { t: "aviso", n: "aviso", x: "J7 es el **header de PCB** 43045-2400, no la carcasa 43020. Si compras la equivocada no encajará." },
    { t: "w", w: "jumpers", f: "Down Converter" },
    { t: "chk", id: "dcs", tit: "Down Converter soldada", i: [["dc1", "J7, J1 y J2 soldados y alineados."], ["dc2", "Header del ventilador y JP1 según tu plan (o sin montar)."], ["dc3", "Sin cortos entre +5 V, +12 V y GND en las borneras."]] }
  ] },
  { id: "4.5", t: "PCB master: montaje", si: { ruta: "master" }, b: [
    { t: "aviso", n: "aviso", x: "El master es un diseño nuevo sin fabricar. Estos pasos salen del diseño y del informe; ajusta lo que encuentres en la placa real." },
    { t: "img", s: "hardware/master_pcb/vistas_previas/PCB_imac_unificado_master_v5_con_corte_vista_previa.png", a: "Vista previa del master", p: "Master v5 con corte para la Pi." },
    { t: "tabla", c: ["Ref.", "Componente"], f: [["T_J22_J2 / T_DC_J1", "Terminales de tornillo de 10, paso 5,00 mm"], ["T_J20_J1", "Terminal de tornillo de 6"], ["T_DC_J2", "Terminal de tornillo de 4"], ["T_J20_J5", "Header 2×3 de 2,54 mm"], ["R_DIV1 / R_DIV2", "1 kΩ / 2 kΩ, SMD 0805 (divisor del UART)"], ["J_PI_GPIO", "Header 1×8 (pines pares 2–16 de la Pi)"], ["J_AUDIO_IN", "Header 1×3 (L, GND, R)"], ["U_AMP", "Módulo PAM8403 de 2,54 mm (19,05 × 22,86 mm)"]] },
    { t: "chk", id: "ms", tit: "Master montado", i: [["ms1", "Resistencias SMD del divisor soldadas."], ["ms2", "Terminales y headers soldados, dentro del contorno."], ["ms3", "Módulo PAM8403 montado en U_AMP, con sus pines orientados según la serigrafía."], ["ms4", "Continuidad de GND en los tornillos de la base."]] }
  ] },
  { id: "4.6", t: "Revisión final de las soldaduras", b: [
    { t: "chk", id: "revsol", tit: "Antes de seguir", i: [["rs1", "Inspeccioné todas las soldaduras con lupa: sin puentes ni soldaduras frías."], ["rs2", "Con el multímetro en continuidad: sin pitido entre +5 V y GND en las borneras."], ["rs3", "Los tornillos de montaje de cada placa tienen continuidad a GND."], ["rs4", "Limpié el flux con alcohol isopropílico."]] }
  ] }
] },

/* ======================= 5 ======================= */
{ id: 5, ico: "5", t: "Programar el ATmega328P", r: "Preparar Arduino IDE, editar los buffers I²C y grabar el firmware.", pasos: [
  { id: "5.1", t: "Instala Arduino IDE y las librerías", b: [
    { t: "p", x: "El firmware es el sketch `imacG3IvadInit.ino` (original de qbancoffee). Necesita dos librerías, que instalas desde el **Gestor de bibliotecas** del IDE:" },
    { t: "lista", i: ["**SoftwareWire**", "**EEPROMWearLevel**"] },
    { t: "w", w: "dl_firmware" }
  ] },
  { id: "5.2", t: "Edita los buffers I²C (obligatorio)", b: [
    { t: "p", x: "El bloque [[EDID]] completo ocupa 128 bytes, pero la librería `Wire` de Arduino tiene un buffer de 32. Hay que cambiar dos archivos **antes de compilar**:" },
    { t: "cod", l: "c", x: "// Wire.h  (libraries/Wire/src/Wire.h)\n#define BUFFER_LENGTH 128      // originalmente 32\n\n// twi.h  (libraries/Wire/src/utility/twi.h)\n#define TWI_BUFFER_LENGTH 128  // originalmente 32" },
    { t: "p", x: "Rutas habituales (busca `Wire.h` si no coinciden):" },
    { t: "tabla", c: ["Sistema", "Carpeta típica"], f: [["Windows (IDE 1.x)", "C:\\Program Files (x86)\\Arduino\\hardware\\arduino\\avr\\libraries\\Wire\\src"], ["macOS (IDE 1.x)", "/Applications/Arduino.app/Contents/Java/hardware/arduino/avr/libraries/Wire/src"], ["Arduino IDE 2.x (Linux/macOS)", "~/.arduino15/packages/arduino/hardware/avr/<versión>/libraries/Wire/src"]] },
    { t: "aviso", n: "aviso", x: "Si actualizas el paquete de placas Arduino AVR, esos cambios se pierden: vuelve a aplicarlos." }
  ] },
  { id: "5.3", t: "Método 1: grabar el chip en un Arduino Uno", b: [
    { t: "num", i: ["Retira con cuidado el ATmega328P original de un **Arduino Uno** (con un extractor o una herramienta fina; sin doblar patas).", "Inserta el chip virgen en el zócalo DIP del Arduino.", "Abre `imacG3IvadInit.ino`.", "Herramientas → Placa → **Arduino Uno** y selecciona el puerto.", "Herramientas → **Grabar bootloader** y después **Subir**.", "Retira el chip programado y colócalo en el zócalo de la placa **J20**, con la muesca en el sentido de la serigrafía."] },
    { t: "aviso", n: "consejo", x: "Este método es el más seguro: no hay que trabajar cerca de la placa analógica con red conectada." }
  ] },
  { id: "5.4", t: "Método 2: grabar en la J20 por ISP (opcional)", b: [
    { t: "p", x: "Puedes programar el chip ya montado, usando un Arduino Uno con el sketch **ArduinoISP** conectado al header J3 de la J20:" },
    { t: "tabla", c: ["J3", "Señal", "Arduino Uno"], f: [["1", "MISO", "D12"], ["2", "5 V trickle", "no conectar"], ["3", "SCK", "D13"], ["4", "MOSI", "D11"], ["5", "RESET", "D10"], ["6", "GND", "GND"]] },
    { t: "img", s: MB.img("arduino_uno_isp.png"), a: "Arduino Uno como programador ISP de la placa J20", p: "Conexión del Arduino Uno como ISP (proyecto original)." },
    { t: "aviso", n: "peligro", x: "El diagrama **no conecta 5 V**: la J20 se alimenta del 5 V trickle, con la placa instalada en el iMac **enchufado a la red**. Eso te obliga a trabajar junto a la placa analógica con red conectada. Si no te sientes cómodo, usa el método 1." },
    { t: "p", x: "En el IDE: Herramientas → Programador → «Arduino as ISP» y usa «Subir con programador»." }
  ] },
  { id: "5.5", t: "Comprueba la grabación", b: [
    { t: "p", x: "La prueba definitiva es la fase 8: al pulsar el botón, la CRT debe encender y el LED verde iluminarse. Antes de instalar:" },
    { t: "chk", id: "prog", tit: "Programación", i: [["pg1", "Edité Wire.h y twi.h (128 bytes) antes de compilar."], ["pg2", "El sketch compiló sin errores con SoftwareWire y EEPROMWearLevel."], ["pg3", "Grabé el chip (método 1 o 2) y lo coloqué en U1 con la muesca bien orientada."]] }
  ] }
] },

/* ======================= 6 ======================= */
{ id: 6, ico: "6", t: "Instalar las placas en el chasis", r: "Enchufar J20, J22 y la PAV, fijar con tornillos y decidir dónde va la Pi.", pasos: [
  { id: "6.1", t: "Mira cómo queda", b: [
    { t: "img", s: MB.img("all_boards_installed.jpg"), a: "Todas las placas instaladas y cableadas en el chasis", p: "Las tres placas instaladas y cableadas (proyecto original)." },
    { t: "img", s: MB.img("J20_and_J22_in_view.jpg"), a: "Placas J20 y J22 a la vista", p: "Las placas J20 y J22 en su sitio." }
  ] },
  { id: "6.2", t: "Enchufa la placa J20", b: [
    { t: "num", i: ["Toma el arnés J20 de 20 pines (el que venía de la placa analógica).", "Alinea el **pin 1** con la marca de la placa.", "Presiona a fondo y de forma pareja sobre el header J2 de la J20 (cara inferior)."] },
    { t: "img", s: MB.img("J20_board_installed.jpg"), a: "Placa J20 instalada", p: "J20 instalada. El DB15 queda a la vista para el cable VGA." },
    { t: "aviso", n: "aviso", x: "Si el header queda girado 180° el arnés no hará nada útil, y podrías poner 5 V donde no toca. Revisa la orientación **dos veces**." }
  ] },
  { id: "6.3", t: "Enchufa la placa J22", b: [
    { t: "num", i: ["Toma el arnés J22 de 26 pines.", "Alinea el pin 1 y presiona a fondo sobre el header J1 de la J22 (cara inferior)."] },
    { t: "img", s: MB.img("J22_board_installed.jpg"), a: "Placa J22 instalada", p: "J22 instalada con sus borneras a la vista." }
  ] },
  { id: "6.4", t: "Conecta la placa PAV a la breakout", b: [
    { t: "p", x: "La placa PAV (la fuente original) se acopla a la placa Down Converter por J7, igual que antes se acoplaba a la placa lógica." },
    { t: "img", s: MB.img("down_converter_breakout_board_installed.jpg"), a: "Placa down converter breakout instalada", p: "La breakout con la PAV encima, con sus borneras a la vista." },
    { t: "aviso", n: "consejo", x: "Presiona el conector negro de la PAV de forma pareja; no hagas palanca sobre los pines del Molex." }
  ] },
  { id: "6.5", t: "Fija con tornillos", b: [
    { t: "p", x: "Los tornillos de montaje de cada placa son **GND común** con el chasis. Apriétalos bien y comprueba continuidad entre cada tornillo y GND." },
    { t: "chk", id: "tornillos", tit: "Fijación", i: [["tn1", "J20 fijada con sus tornillos y continuidad a GND."], ["tn2", "J22 fijada con sus tornillos y continuidad a GND."], ["tn3", "Down Converter fijada con sus tornillos y continuidad a GND."]] }
  ] },
  { id: "6.6", t: "Instala el PCB master", si: { ruta: "master" }, b: [
    { t: "aviso", n: "aviso", x: "Diseño sin probar. Revisa en tu iMac que los bolsillos y los orificios coinciden antes de atornillar." },
    { t: "lista", i: ["El master tiene la **forma de la placa lógica 820-1131-A** y se instala en su lugar.", "Las tres placas individuales se atornillan **aparte**, dentro de sus bolsillos (holgura de 0,3 mm). Conservan sus borneras.", "El master se fija a la base con tornillos M3 (`H_BASE_A` y `H_BASE_B`).", "Cada placa conserva sus tornillos: los bolsillos solo dan alineación."] },
    { t: "w", w: "visor3d_link" }
  ] },
  { id: "6.7", t: "Decide dónde va la Raspberry Pi 5", b: [
    { t: "lista", i: ["Con el master, la Pi 5 (con su case) cae en un hueco de **102 × 74 mm**.", "Los soportes `rpi_mount` son para **Pi 4**: el patrón de agujeros coincide, pero Ethernet y USB están intercambiados en la Pi 5. Revisa el recorte del bisel v3.", "Deja circulación de aire: la Pi 5 se calienta."] },
    { t: "aviso", n: "consejo", x: "Antes de fijar nada, pon la Pi donde irá y comprueba que el cable micro-HDMI, el USB y el cable de alimentación llegan sin tensión." }
  ] }
] },

/* ======================= 7 ======================= */
{ id: 7, ico: "7", t: "Cablear", r: "Cada cable, de dónde a dónde, con su calibre y su comprobación.", pasos: [
  { id: "7.1", t: "Reglas antes de cablear", b: [
    { t: "aviso", n: "peligro", x: "Cablea con el iMac **desenchufado**." },
    { t: "lista", i: ["Pela unos 5 mm y estaña las puntas (o usa terminales de casquillo) antes de apretar la bornera.", "Tira suavemente de cada cable al apretar: no debe soltarse.", "Usa el calibre indicado en cada tarjeta: los de potencia son más gruesos y cortos.", "Los 24 VAC van en **par trenzado**.", "Deja holgura para poder volver a conectar los cables originales si algún día quieres revertir."] }
  ] },
  { id: "7.2", t: "El cableado de tu montaje", b: [
    { t: "p", x: "Estas son las conexiones que corresponden a tu plan. Marca cada una al terminarla; abre la tarjeta para ver pines y notas." },
    { t: "w", w: "cables" },
    { t: "img", s: MB.img("basic_wiring.png"), a: "Diagrama general de cableado básico", p: "Diagrama general de cableado del proyecto original." }
  ] },
  { id: "7.3", t: "Mira el mapa de cableado", b: [
    { t: "p", x: "El visor interactivo muestra el mismo cableado sobre las placas." },
    { t: "w", w: "visor_cableado" }
  ] },
  { id: "7.4", t: "Alimentación de la Pi", b: [
    { t: "p", x: "Tu opción actual aparece resaltada. Si dudas, cámbiala aquí." },
    { t: "w", w: "alim" }
  ] },
  { id: "7.5", t: "Audio", b: [
    { t: "lista", i: ["El adaptador entrega audio por su jack (o por un extractor HDMI).", "El **PAM8403** amplifica y sus salidas van a los parlantes originales por la J22.", "Las salidas del PAM8403 son BTL: **ningún «−» va a GND**.", "Si escuchas zumbido, une el GND de entrada y el del amplificador en un solo punto."] },
    { t: "img", s: MB.img("raspberry_pi_wiring.png"), a: "Esquema de cableado de la Pi (Pi 4, proyecto original)", p: "Esquema original con Pi 4 (I²C directo). En esta guía el ATmega de la J20 hace la inicialización, así que **no** conectes el I²C de la Pi al cable J20." }
  ] },
  { id: "7.6", t: "Revisión antes de energizar", b: [
    { t: "chk", id: "antes", tit: "Antes de enchufar el iMac", i: [["an1", "ATmega programado con imacG3IvadInit (buffers a 128) y bien orientado en su zócalo."], ["an2", "Headers J2 de la J20 y J1 de la J22 soldados por la cara inferior y enchufados."], ["an3", "JP3 soldado en la J20 (apagado automático por VSYNC). En la J22, JP3 sin soldar."], ["an4", "Tornillos de montaje de las tres placas con continuidad a GND del chasis."], ["an5", "Sin corto entre +5 V y GND en la bornera J1 de la placa DC."], ["an6", "Salidas del amplificador cableadas sin unir ningún «−» a GND."], ["an7", "La Pi **no** está conectada todavía a los rieles."]] }
  ] }
] },

/* ======================= 8 ======================= */
{ id: 8, ico: "8", t: "Probar sin la Pi", r: "Primer encendido guiado con el multímetro.", pasos: [
  { id: "8.1", t: "Primer encendido, paso a paso", b: [
    { t: "aviso", n: "peligro", x: "Ahora enchufas el iMac. Con la CRT encendida hay alto voltaje: no toques el tubo ni el flyback. Trabaja con una sola mano y la Pi aún **desconectada**." },
    { t: "w", w: "multi" }
  ] },
  { id: "8.2", t: "Botón, LED y sonido", b: [
    { t: "num", i: ["Con el iMac enchufado, pulsa y **suelta** el botón (el firmware actúa al soltar).", "Debes oír la CRT activarse (el chasquido/zumbido de alta tensión) y ver el **LED verde** encendido.", "Mide los rieles de la placa DC (paso anterior).", "Pulsa de nuevo para apagar: la CRT se apaga y el LED también."] },
    { t: "ok", x: "El LED verde se enciende al soltar el botón, la CRT hace su sonido y aparecen +3,3, +5 y +12 V en la bornera J1 de la placa DC." },
    { t: "fallo", x: "Si no pasa nada, ve a **Diagnóstico → «La CRT no enciende al pulsar el botón»**." },
    { t: "img", s: MB.img("analog_board_on.jpg"), a: "Señal de la placa analógica encendida", p: "Osciloscopio con la placa analógica encendida (proyecto original)." }
  ] },
  { id: "8.3", t: "Prueba el +5 V con carga", b: [
    { t: "p", x: "Antes de conectar la Pi, comprueba que el riel de +5 V aguanta: conecta una **carga resistiva de potencia** que tire de una corriente parecida a la esperada (la Pi 5 puede pedir hasta 5 A) y mide con **MIN/MAX HOLD**: no debe bajar de **4,75 V**." },
    { t: "aviso", n: "aviso", x: "La capacidad real del riel +5 V del down converter no está documentada. Si cae por debajo de 4,75 V, la opción A no es adecuada para tu equipo: considera B o F." }
  ] }
] },

/* ======================= 9 ======================= */
{ id: 9, ico: "9", t: "Configurar la Raspberry Pi 5", r: "Sistema operativo, modo de video, UART, audio y alimentación.", pasos: [
  { id: "9.1", t: "Instala el sistema", b: [
    { t: "num", i: ["Graba **Raspberry Pi OS** en la microSD con Raspberry Pi Imager. Activa SSH y la red en las opciones del Imager.", "Arranca la Pi con un **monitor normal** por micro-HDMI 0 y deja todo configurado antes de llevarla al iMac.", "Actualiza: `sudo apt update && sudo apt full-upgrade`."] },
    { t: "aviso", n: "consejo", x: "Con la opción F elige Raspberry Pi OS **Lite** si quieres que un solo toque del botón apague todo." }
  ] },
  { id: "9.2", t: "Fija el modo de video", b: [
    { t: "p", x: "Con la Pi 5 el modo se fija en `cmdline.txt` (las directivas `hdmi_*` antiguas se ignoran con [[KMS]]). El generador crea los textos a tu medida:" },
    { t: "w", w: "pi5cfg" },
    { t: "aviso", n: "aviso", x: "`cmdline.txt` es **una sola línea**: añade el texto al final de esa línea, con un espacio delante, sin saltos de línea." },
    { t: "aviso", n: "info", x: "La CRT solo acepta los modos de su EDID (1024×768@75, 800×600@95 y 640×480@117), todos con ~60 kHz de frecuencia horizontal. 1024×768 a 60 Hz **no** funciona." }
  ] },
  { id: "9.3", t: "Alimentación de la Pi: valida bajo carga", b: [
    { t: "cod", l: "bash", x: "vcgencmd get_throttled   # esperado: throttled=0x0\nstress-ng --cpu 4 --timeout 60s   # (sudo apt install stress-ng) mientras repites el comando" },
    { t: "ok", x: "`throttled=0x0` con la CPU y el USB bajo carga." },
    { t: "fallo", x: "Si ves un valor distinto de 0x0, mira **Diagnóstico → «La Pi se reinicia o avisa de poca energía»**." }
  ] },
  { id: "9.4", t: "UART para calibrar desde la Pi", si: { uart: true }, b: [
    { t: "p", x: "Para hablar con el ATmega a 115200 baudios por `/dev/ttyAMA0`:" },
    { t: "cod", l: "ini", x: "# /boot/firmware/config.txt\ndtparam=uart0=on" },
    { t: "cod", l: "bash", x: "sudo apt install screen\nscreen /dev/ttyAMA0 115200   # luego pulsa p" },
    { t: "aviso", n: "peligro", x: "**No conectes el TX del ATmega (5 V) directo a la Pi.** Usa el divisor: 1 kΩ en serie y 2 kΩ a GND (≈3,3 V). Es el único punto donde un error puede dañar una GPIO." },
    { t: "w", w: "divisor" },
    { t: "aviso", n: "consejo", x: "Si habilitaste una consola serie en `raspi-config`, desactívala (deja el hardware serie habilitado) para que no compita con el ATmega." }
  ] },
  { id: "9.5", t: "Prueba la imagen en la CRT", b: [
    { t: "num", i: ["Apaga la Pi y llévala al iMac. Conéctala al adaptador HDMI→VGA y este a J4 de la J20.", "Pulsa el botón del iMac: la CRT enciende y la Pi arranca.", "Espera unos segundos: debes ver el arranque a 1024×768."] },
    { t: "ok", x: "Imagen estable a 1024×768 y 75 Hz." },
    { t: "fallo", x: "Si no sincroniza: prueba `1024x768M@75D` (timings CVT) o baja a `800x600@95D`. Ver **Diagnóstico**." },
    { t: "tabla", c: ["Modo", "Modeline (referencia para Linux/X11)"], f: [["1024×768", "Modeline \"1024x768\" 78.75 1024 1044 1140 1328 768 781 784 820 +hsync +vsync"], ["800×600", "Modeline \"800x600\" 62.40 800 821 901 1040 600 609 612 644 +hsync +vsync"], ["640×480", "Modeline \"640x480\" 49.90 640 657 721 832 480 481 484 514 +hsync +vsync"]] }
  ] },
  { id: "9.6", t: "Prueba el audio", b: [
    { t: "num", i: ["En el menú de sonido de Raspberry Pi OS, elige la salida **HDMI**.", "Prueba: `speaker-test -c2 -t wav` (debes oír izquierda y derecha).", "Sin sonido: alimenta el adaptador por USB (si la pide) y revisa el +5 V del amplificador."] },
    { t: "ok", x: "Audio en ambos parlantes, sin zumbido." }
  ] },
  { id: "9.7", t: "Opción F: botón sincronizado", si: { alim: "F" }, b: [
    { t: "p", x: "Cablea un segundo hilo desde el contacto del botón (o desde J22 J2-4) hasta un lado del header J2 de la Pi 5; el otro lado va a GND. Es una conexión pasiva en paralelo." },
    { t: "tabla", c: ["Evento", "CRT", "Pi"], f: MB.ALIM_EVENTOS_F }
  ] },
  { id: "9.8", t: "Apagado correcto", b: [
    { t: "aviso", n: "aviso", x: "Apaga siempre con `sudo poweroff`. Sin señal de video, el ATmega apaga la CRT y los rieles en unos **3 minutos** (requiere JP3 soldado)." },
    { t: "aviso", n: "info", x: "Con la opción A, si pulsas el botón con la Pi encendida le cortas la energía de golpe. Evítalo." }
  ] }
] },

/* ======================= 10 ======================= */
{ id: 10, ico: "10", t: "Calibrar y cerrar", r: "Ajustar la geometría de la imagen y cerrar el iMac.", pasos: [
  { id: "10.1", t: "Calibra la imagen", b: [
    { t: "p", x: "El ATmega acepta teclas por serie (115200 baudios) para ajustar la geometría, el brillo y el contraste en tiempo real. Prueba cada tecla aquí para ver qué hace:" },
    { t: "w", w: "calib" },
    { t: "aviso", n: "info", x: "Solo responde con la CRT **encendida**. Con la Pi en el riel conmutado, la tecla `o` también le corta la energía." }
  ] },
  { id: "10.2", t: "Conectar para calibrar", b: [
    { t: "lista", i: ["**Desde la Pi** (si cableaste el UART): `screen /dev/ttyAMA0 115200`.", "**Con un adaptador USB-serie** (TTL, 5 V): TX/RX cruzados a J5 y GND a J3-6.", "**Con la utilidad Java** (`ImacG3DVDisplayProperties.jar`): panel gráfico con flechas por categoría."] },
    { t: "img", s: MB.img("wiring_usb_2_serial_debugger.jpg"), a: "Adaptador USB a serie conectado a la J20", p: "Un adaptador USB-serie conectado a la J20 (proyecto original)." },
    { t: "cod", l: "bash", x: "cd utilidades/ImacG3DVDisplayProperties/dist\njava -jar ImacG3DVDisplayProperties.jar" },
    { t: "enlaces", i: [["Vídeo: ajuste de parámetros con la GUI en Java", "https://youtu.be/zrzcvThxDeY", ""]] }
  ] },
  { id: "10.3", t: "Hacer que el ajuste se conserve", b: [
    { t: "aviso", n: "aviso", x: "Según el código del firmware, las teclas cambian la imagen pero **no escriben la EEPROM**: el ATmega guarda en EEPROM solo con un comando binario del protocolo (el que la utilidad Java no usa). Al apagar y encender, la CRT vuelve a los valores de arranque." },
    { t: "num", i: ["Calibra la imagen con las teclas hasta que quede bien.", "Pulsa `p` y **anota todos los valores**.", "Pon esos valores en la secuencia de inicialización de `imacG3IvadInit.ino` (las líneas `writeToIvad( 0x46, …)`) y vuelve a grabar el chip (fase 5).", "Apaga y enciende: la imagen debe arrancar ya calibrada."] },
    { t: "aviso", n: "info", x: "Esto lo deduje leyendo el código; compruébalo en tu equipo. Si encuentras otra forma, cuéntalo en un *issue*." }
  ] },
  { id: "10.4", t: "Pruebas finales", b: [
    { t: "chk", id: "final", tit: "Con la Pi conectada", i: [["fn1", "`vcgencmd get_throttled` devuelve 0x0 con CPU y USB bajo carga."], ["fn2", "Imagen estable a 1024×768 y 75 Hz."], ["fn3", "Audio en ambos parlantes, sin zumbido."], ["fn4", "Con UART: la tecla `p` muestra los ajustes actuales."], ["fn5", "`sudo poweroff`: la CRT se apaga sola en unos 3 minutos."]] }
  ] },
  { id: "10.5", t: "Cierra el iMac", b: [
    { t: "lista", i: ["Ordena los cables lejos del flyback y de la placa analógica; que no queden pellizcados.", "Comprueba que el **cable de la antena** no quede bajo ninguna placa.", "Coloca el bisel interior con suavidad.", "Cierra la carcasa siguiendo el manual de Apple en orden inverso."] },
    { t: "aviso", n: "peligro", x: "No cierres con la CRT encendida ni con herramientas dentro." }
  ] }
] },

/* ======================= 11 ======================= */
{ id: 11, ico: "11", t: "Uso diario", r: "Cómo enciende, cómo apagar y qué mirar si algo falla.", pasos: [
  { id: "11.1", t: "Qué ocurre al encender", b: [
    { t: "p", x: "Pulsa cada paso para ver qué pasa por dentro:" },
    { t: "w", w: "secuencia" }
  ] },
  { id: "11.2", t: "Buenas prácticas", b: [
    { t: "lista", i: ["Apaga con `sudo poweroff` y deja que la CRT se apague sola.", "No dejes imagen estática durante horas: la CRT se marca.", "Si cambias de Pi o de sistema, repite la fase 9.", "Mantén los cables de potencia cortos y revisa el apriete de las borneras de vez en cuando."] }
  ] },
  { id: "11.3", t: "Si algo falla", b: [
    { t: "p", x: "El diagnóstico guiado cubre los síntomas más habituales." },
    { t: "enlaces", i: [["Ir al diagnóstico", "#/t/diagnostico", "Elige el síntoma y revisa las causas en orden."]] }
  ] }
] }
];
