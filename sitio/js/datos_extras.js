/* MacBerry Pi G3 · páginas extra: camino sin PCBs y créditos. */
window.MB = window.MB || {};
(function () {
  const IM = "originales/imagenes/";
  MB.EXTRAS = [
    { t: "aviso", n: "aviso", x: "Este es el **camino original**, anterior a las placas: cableado a mano y un Arduino o una Raspberry Pi que envía la inicialización. Funciona, pero tiene más cables sueltos y sin el apagado automático por VSYNC. **Para esta guía usa las placas.** Las tablas de pines de la guía antigua pueden diferir: usa siempre la herramienta «Pines»." },
    { t: "aviso", n: "info", x: "Con una Raspberry Pi 5, `init_ivad.py` y `rc.local` solo aplican **sin** la placa J20 (con la J20 la inicialización la hace el ATmega). El modo de video se fija en `cmdline.txt`, no con `hdmi_*`." },

    { t: "h", x: "1 · Fabrica el cable VGA ↔ J20" },
    { t: "img", s: IM + "vga_adapter.png", a: "Esquema del cable VGA al conector J20", p: "Cable VGA al conector J20 (basado en el pinout de ym58). Los colores de los cables J20 de la imagen son los del iMac del autor: verifica los tuyos con el multímetro." },
    { t: "tabla", c: ["DE15 (VGA)", "Señal", "J20"], f: [["1", "Rojo", "17 (retorno: 18)"], ["2", "Verde", "15 (retorno: 16)"], ["3", "Azul", "13 (retorno: 14)"], ["13", "H-SYNC", "9"], ["14", "V-SYNC", "11"], ["5, 10", "GND", "GND (3, 4 o 20)"], ["12 / 15", "SDA / SCL (DDC)", "solo si emulas EDID con un Arduino"]] },
    { t: "num", i: ["Consigue un cable VGA que puedas cortar y corta uno de los extremos, conservando al menos **una ferrita**.", "Pela la funda para dejar 7–10 cm de hilos manejables.", "Pela cada hilo y mide continuidad para saber qué color va a cada pin del DE15: no todos los cables VGA usan los mismos colores.", "Mapea el cable a J20 con la tabla de arriba.", "**Opción 1:** suelda los cables a un header de 20 pines y enchúfalo en J20.", "**Opción 2:** corta los cables necesarios de J20 y empálmalos (soldadura y termorretráctil). Deja largo suficiente para poder volver a conectar los originales."] },
    { t: "img", s: IM + "harness.jpg", a: "Arnés manual con pinzas etiquetadas", p: "Arnés manual del autor: pinzas etiquetadas DCO, tensión trickle, PFW, LP, líneas I²C (SDA y SCL), GROUND («muy importante») y el DE15 del VGA. El header modificado con los cables soldados se enchufa en J20." },

    { t: "h", x: "2 · Encender y apagar la CRT a mano" },
    { t: "tabla", c: ["Acción", "Pines de J20"], f: [["Encender", "unir 6, 10 y 12 con un cable corto y enviar la inicialización"], ["Apagar", "desconectar el pin 6 (5 V trickle)"]] },
    { t: "img", s: IM + "crt_power_on_and_off.png", a: "Encendido y apagado de la CRT", p: "Con la CRT encendida hay miles de voltios en el flyback: no toques el tubo ni el cable que va a él." },
    { t: "img", s: IM + "imac_g3_slot_loading_pav_board.png", a: "Alimentación de la placa PAV", p: "La placa analógica da 24 VAC a la PAV por J22; conectando la PAV directamente a la analógica genera +12, +5 y +3,3 V." },

    { t: "h", x: "3 · Inicializar el IVAD con un Arduino" },
    { t: "p", x: "Un Arduino puede enviar la secuencia I²C a la IVAD. El sketch espera un botón en un pin; si quieres que la envíe en cuanto reciba energía, descomenta `initIvadBoard();` dentro de `setup()`. Puede que debas ajustar los valores de la secuencia (brillo, contraste, geometría) para tu tubo." },
    { t: "cod", l: "c", x: "  writeToIvad( 0x46, 0x04, 0x80); // rojo x-30\n  writeToIvad( 0x46, 0x05, 0xB0); // verde x\n  writeToIvad( 0x46, 0x06, 0x78); // azul x-38\n\n  writeToIvad( 0x46, 0x07, 0xB1); // posición horizontal\n  writeToIvad( 0x46, 0x08, 0xF8); // tamaño vertical", c: "Ejemplo de la secuencia de inicialización (firmware/imacG3IvadInit)" },
    { t: "imgs", i: [[IM + "arduino_uno_wiring.png", "Cableado con Arduino Uno"], [IM + "arduino_nano_wiring.png", "Cableado con Arduino Nano"]] },
    { t: "p", x: "Recuerda editar los buffers de `Wire.h` y `twi.h` a 128 (fase 5) si también vas a emular el EDID." },
    { t: "h", x: "4 · Emular el EDID con un Arduino (opcional)" },
    { t: "p", x: "El sketch `edidSimulator.ino` hace que el Arduino responda como la memoria EDID de un monitor y entregue el bloque a la computadora por las líneas DDC del VGA (12, 15 y 5 del DE15)." },
    { t: "imgs", i: [[IM + "arduino_uno_wiring_to_transmit_edid.png", "Arduino Uno transmitiendo EDID"], [IM + "arduino_nano_wiring_to_transmit_edid.png", "Arduino Nano transmitiendo EDID"]] },

    { t: "h", x: "5 · Inicializar con una Raspberry Pi (método original, Pi 4)" },
    { t: "aviso", n: "aviso", x: "Este método viene del proyecto original, escrito para Pi 4. **No está probado con Pi 5** aquí; con Pi 5 sustituye la parte de video por `cmdline.txt` (fase 9)." },
    { t: "img", s: IM + "raspberry_pi_wiring.png", a: "Cableado I²C de la Raspberry Pi a la J20", p: "I²C de la Pi (SDA, SCL y GND) a los pines 1, 2 y 3 de J20, y el VGA por un convertidor HDMI→VGA." },
    { t: "cod", l: "bash", x: "sudo raspi-config                      # habilita SSH e I2C\nsudo apt-get update && sudo apt-get -y install i2c-tools git python3-smbus python3-rpi.gpio\nsudo cp firmware/init_ivad.py /usr/local/bin/\nsudo chmod +x /usr/local/bin/init_ivad.py", c: "Preparación" },
    { t: "cod", l: "bash", x: "i2cdetect -y 1   # con el iMac enchufado: deben aparecer las direcciones 46 y 53", c: "Comprobar que la Pi ve la IVAD" },
    { t: "cod", l: "bash", x: "# /etc/rc.local, antes de «exit 0»\n/usr/local/bin/init_ivad.py", c: "Ejecutar la inicialización al arrancar" },
    { t: "p", x: "Enciende la CRT con el cable (pines 6, 10 y 12) y ejecuta `/usr/local/bin/init_ivad.py`: debe sonar el clásico «CRT encendida». Si no aparece nada en pantalla, mueve el ratón: la Pi puede haber apagado la pantalla." },
    { t: "enlaces", i: [["Vídeo: modificando el iMac G3 DV usando únicamente una Raspberry Pi", "https://youtu.be/xSiqchucFE4", ""], ["Vídeo: inicialización de la IVAD con Arduino Uno", "https://youtu.be/JLaHMjQ7idI", ""], ["Wiki del proyecto original", "https://github.com/qbancoffee/imac_g3_ivad_board_init/wiki", "Cómo se hizo la ingeniería inversa."]] }
  ];

  MB.CREDITOS = [
    { t: "h", x: "Proyecto original" },
    { t: "p", x: "**[qbancoffee (Rocky Hill)](https://github.com/qbancoffee)** creó [`imac_g3_ivad_board_init`](https://github.com/qbancoffee/imac_g3_ivad_board_init): la ingeniería inversa de la placa IVAD, la secuencia de inicialización I²C, el firmware (Arduino y Raspberry Pi), el emulador de EDID, la utilidad Java, el wiki y **las tres placas adaptadoras y sus esquemas** (J20, J22 y breakout del Down Converter). Licencia **LGPL-3.0**." },
    { t: "h", x: "Contribuciones de terceros" },
    { t: "lista", i: ["**Anthony Bernaert** ([imac-g3-screen-bezel](https://github.com/anthony-bernaert/imac-g3-screen-bezel)): bisel interior imprimible en 3D. Licencia **CC BY-NC 4.0** (solo uso no comercial). Su apoyo: [ko-fi.com/abernaert](https://ko-fi.com/abernaert).", "**Nicolas Robin** ([github.com/nicolas-robin](https://github.com/nicolas-robin)): escaneo 3D del bisel original, referencia del diseño de Anthony.", "**Rudy** ([reng.ca](https://reng.ca)): soportes 3D de la Raspberry Pi (`rpi_mount`, para Pi 4) y las placas RPiG3iMac."] },
    { t: "h", x: "Agradecimientos del proyecto original" },
    { t: "lista", i: ["**patriciooholegu**: inspiración del eMac.", "**ym58**: cableado del conector de video.", "**Eric Bylenga**: patillaje de la placa PAV.", "**sparpet** y **anotherelise**: captura del código de inicialización de la IVAD y de las propiedades del CRT.", "**jamie-g**: ajuste del monitor I²C.", "**DrJekyll_XYZ**: salida `xrandr` para el EDID y sugerencia del PAM8403.", "**oshimai** ([shuuryou/imacg3](https://github.com/shuuryou/imacg3)): extracción del EDID y monitoreo de VSYNC para apagar el CRT.", "**Tech Chrunch**: video del reemplazo de altavoces."] },
    { t: "h", x: "Este repositorio" },
    { t: "p", x: "**[JJaroll.dev](https://jjaroll.dev)**: traducción al español, serigrafía en español de las 3 placas, guía de cableado con Raspberry Pi 5 (pines verificados contra KiCad), **PCB master unificado** (v5), visores 3D y mapas de cableado, y esta guía interactiva. Parte del diseño del master, la verificación y esta guía se desarrollaron con ayuda de Claude (Anthropic)." },
    { t: "h", x: "Licencias" },
    { t: "tabla", c: ["Parte", "Licencia"], f: [["Repositorio (documentación, placas, firmware, visores, esta guía)", "LGPL-3.0"], ["`stl/bezel/` (bisel interior)", "CC BY-NC 4.0 (solo uso no comercial), Anthony Bernaert"], ["Firmware y utilidad Java", "LGPL-3.0, qbancoffee (sin modificar)"]] },
    { t: "enlaces", i: [["Repositorio MacBerry-Pi", "https://github.com/JJaroll/MacBerry-Pi", ""], ["Créditos completos (CREDITOS.md)", "https://github.com/JJaroll/MacBerry-Pi/blob/master/CREDITOS.md", ""], ["Abrir un issue", "https://github.com/JJaroll/MacBerry-Pi/issues", "Errores, dudas o pruebas de hardware."]] }
  ];
})();
