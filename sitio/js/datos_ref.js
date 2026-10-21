/* MacBerry Pi G3 · datos de referencia (cables, pines, jumpers, alimentación, compras, diagnóstico, glosario, descargas).
   Fuente técnica: docs/guia_cableado_pi5.md (pines verificados contra KiCad). Marcado inline: **negrita**, `código`, [[término]], [texto](url). */
window.MB = window.MB || {};

/* ---------- Configuración por defecto del plan ---------- */
MB.DEF = { ruta: "indiv", alim: "A", uart: true, mic: false, ambar: false, fan: "no", jack: true, usbad: false, bezel: "imprimir" };

/* ---------- Asistente de plan ---------- */
MB.PLAN = [
  { k: "ruta", q: "¿Cómo vas a unir las placas?", ayuda: "Las tres placas individuales (J20, J22 y Down Converter) se usan siempre. La diferencia es cómo se conectan entre sí.",
    op: [
      { v: "indiv", t: "Placas individuales + cables", d: "Camino del proyecto original: cables punto a punto entre placas. Es el más probado.", rec: true },
      { v: "master", t: "Con el PCB master", d: "Una placa grande reemplaza casi todos los cables por pistas. Diseño nuevo: DRC limpio pero todavía sin fabricar ni probar en hardware." }
    ] },
  { k: "alim", q: "¿Cómo vas a alimentar la Raspberry Pi 5?", ayuda: "Si dudas, deja la A: es la más simple y es la que usa el resto de la guía. Hay un asistente en «Herramientas → Alimentación Pi 5».",
    op: [
      { v: "A", t: "A · GPIO desde el riel +5 V", d: "Sin módulos extra. La Pi enciende y se apaga con la CRT.", rec: true },
      { v: "B", t: "B · Reductor desde +15 V standby", d: "La Pi puede quedar encendida con la CRT apagada. Requiere módulo DC-DC y medir antes." },
      { v: "C", t: "C · USB-C desde el riel +5 V", d: "Mismo riel que A, pero entra por el USB-C." },
      { v: "D", t: "D · Buck a USB-C desde +12 V", d: "Un módulo DC-DC genérico baja +12 V a 5 V." },
      { v: "F", t: "F · Cargador oficial + botón sincronizado", d: "La más robusta: la Pi no depende del iMac y se apaga por software." }
    ] },
  { k: "uart", q: "¿Quieres ajustar la imagen desde la propia Pi (serial)?", ayuda: "Son 3 hilos y 2 resistencias. Sin esto necesitas un adaptador USB-serie aparte para calibrar la geometría de la CRT.",
    op: [
      { v: true, t: "Sí, por UART de la Pi", d: "Recomendado: calibras con una terminal en la propia Pi.", rec: true },
      { v: false, t: "No, usaré un adaptador USB-serie", d: "Conectarás un adaptador a J5/J3 de la placa J20 solo para calibrar." }
    ] },
  { k: "jack", q: "¿Tu adaptador HDMI→VGA tiene salida de audio de 3,5 mm?", ayuda: "La Pi 5 no tiene salida analógica: el audio sale por HDMI. Un adaptador con jack te ahorra otro módulo.",
    op: [
      { v: true, t: "Sí, tiene jack de audio", d: "El audio va del jack al amplificador PAM8403.", rec: true },
      { v: false, t: "No, no tiene", d: "Necesitarás un extractor de audio HDMI entre la Pi y el adaptador." }
    ] },
  { k: "usbad", q: "¿Tu adaptador pide alimentación por USB?", ayuda: "Muchos adaptadores lo necesitan para que el audio salga estable. Revisa si trae un puerto micro-USB o USB-C.",
    op: [
      { v: false, t: "No / no sé", d: "Si el audio falla más adelante, vuelve aquí y actívalo." },
      { v: true, t: "Sí, tiene entrada de energía", d: "Se alimenta desde un USB-A de la Pi con un cable corto." }
    ] },
  { k: "mic", q: "¿Usarás el micrófono del chasis?", ayuda: "Solo tiene sentido con una tarjeta de sonido USB con entrada de micrófono. Si no, te ahorras componentes.",
    op: [
      { v: false, t: "No", d: "Dejas sin montar J3, R3, C1 y los jumpers del micrófono en la J22.", rec: true },
      { v: true, t: "Sí", d: "Monta el circuito del micrófono y elige el modo de los jumpers." }
    ] },
  { k: "ambar", q: "¿Quieres usar el LED ámbar como indicador de la Pi?", ayuda: "No está en el diseño original: es una propuesta. Un cable del pin 16 (GPIO23) de la Pi a la J22.",
    op: [
      { v: false, t: "No", d: "El LED ámbar queda sin usar.", rec: true },
      { v: true, t: "Sí", d: "Lo controlas desde la Pi con GPIO23." }
    ] },
  { k: "fan", q: "¿Pondrás un ventilador en la placa Down Converter?", ayuda: "La placa trae un header de 4 pines con jumper JP1 para elegir 5 V o 12 V.",
    op: [
      { v: "no", t: "No", d: "Sin ventilador.", rec: true },
      { v: "5", t: "Sí, de 5 V", d: "JP1 pads 1–2." },
      { v: "12", t: "Sí, de 12 V", d: "JP1 pads 2–3." }
    ] },
  { k: "bezel", q: "¿Qué pasa con el bisel interior?", ayuda: "El bisel original es muy quebradizo. El proyecto incluye uno imprimible en 3D (licencia no comercial).",
    op: [
      { v: "imprimir", t: "Lo voy a imprimir", d: "Se añade la fase de impresión y unión.", rec: true },
      { v: "tengo", t: "Ya lo tengo / uso el original", d: "Se omite la fase de impresión." }
    ] }
];

/* ---------- Cables y conexiones ---------- */
/* ruta: 'indiv' (solo placas individuales), 'master' (solo master), 'ambas'. si: condición sobre el plan. */
MB.CABLES = [
  /* --- Enchufes directos --- */
  { id: "p_j20", cat: "Enchufe directo", titulo: "Arnés J20 ↔ placa J20", ruta: "ambas", desde: "Arnés J20 del chasis (20 pines)", hacia: "Placa J20, header J2 (2×10, cara inferior)", cable: "Sin cables: enchufe directo",
    filas: [["1 / 2", "SDA / SCL del IVAD", "ATmega D4 / D5"], ["5", "DCO", "J1-5"], ["6", "5 V trickle", "ATmega, relé"], ["7 / 8", "PROT / −10 V", "J1-4 / J1-3"], ["9 / 11", "H-SYNC / V-SYNC", "J4-13 / J4-14"], ["10, 12", "PFW, LPIACT", "relé, J1-6"], ["13 / 15 / 17", "Azul / verde / rojo", "J4-3 / 2 / 1"]],
    notas: ["Header macho 2×10 (TSW-110-23-G-D) soldado por la **cara inferior**. Revisa la orientación del pin 1 antes de presionar.", "Tabla completa en «Herramientas → Pines»."] },
  { id: "p_j22", cat: "Enchufe directo", titulo: "Arnés J22 ↔ placa J22", ruta: "ambas", desde: "Arnés J22 del chasis (26 pines)", hacia: "Placa J22, header J1 (2×13, cara inferior)", cable: "Sin cables: enchufe directo",
    filas: [["13–16", "Parlantes", "J2-7…10"], ["17", "Botón", "J2-4"], ["18", "Común", "GND"], ["19 / 20", "LED verde / ámbar", "R1 / R2 220 Ω → J2-3 / J2-5"], ["23–26", "24 VAC", "J2-1 / J2-2"], ["5–10", "Audífonos", "J4"]],
    notas: ["Header macho 2×13 (929665-02-13-I) soldado por la cara inferior.", "Los tornillos de montaje son GND común con el chasis: apriétalos bien."] },
  { id: "p_pav", cat: "Enchufe directo", titulo: "Placa PAV (J7) ↔ placa Down Converter", ruta: "ambas", desde: "Conector J7 de la placa PAV (down converter original)", hacia: "Placa Down Converter, J7 (Molex Micro-Fit 24 pines)", cable: "Sin cables: enchufe directo",
    filas: [["8–11", "24 VAC", "J2-3 / J2-4"], ["5", "DCO", "J2-1"], ["14, 15, 24", "+5 V", "J1-5/6"], ["13", "+12 V", "J1-3/4"], ["1, 18–21", "+3,3 V", "J1-7/8"], ["22 / 12", "+8 V / +15 V standby", "J1-9 / J1-10"]],
    notas: ["Numeración Molex, no la de LG/Apple (ver «Pines»).", "Header Molex Micro-Fit 3.0 **43045-2400** en ángulo recto (DigiKey WM4728-ND). Es el header de PCB, no la carcasa 43020."] },

  /* --- Solo placas individuales --- */
  { id: "c_ac", cat: "24 VAC", titulo: "24 VAC al down converter", ruta: "indiv", desde: "Placa J22, J2-1 y J2-2", hacia: "Placa Down Converter, J2-4 y J2-3", cable: "Par trenzado 18–20 AWG",
    filas: [["J22 J2-1 +AC", "DC J2-4 +AC", "chasis J22-24/26"], ["J22 J2-2 −AC", "DC J2-3 −AC", "chasis J22-23/25"]],
    notas: ["Es corriente **alterna**: mídela con el multímetro en VAC.", "Está presente siempre que el iMac esté enchufado y alimenta los rieles standby del PAV."] },
  { id: "c_dco", cat: "Control", titulo: "DCO: encendido del down converter", ruta: "indiv", desde: "Placa J20, J1-5", hacia: "Placa Down Converter, J2-1", cable: "24–26 AWG",
    filas: [["J20 J1-5", "DC J2-1", "chasis J20-5 → PAV J7-5"]],
    notas: ["La placa analógica activa DCO cuando la CRT enciende. La J20 solo lo lleva a su bornera.", "Sin este cable no aparecen +3,3, +5 ni +12 V y la Pi no arranca."] },
  { id: "c_btn", cat: "Control", titulo: "Botón de encendido", ruta: "indiv", desde: "Placa J22, J2-4", hacia: "Placa J20, J1-1", cable: "24–26 AWG",
    filas: [["J22 J2-4", "J20 J1-1", "chasis J22-17 → ATmega D3"]],
    notas: ["El botón cierra a GND (común en chasis J22-18). La J20 tiene pull-up de 10 kΩ al 5 V trickle.", "El firmware actúa **al soltar** el botón: alterna CRT encendida y apagada."] },
  { id: "c_led", cat: "Control", titulo: "LED verde de encendido", ruta: "indiv", desde: "Placa J20, J1-6", hacia: "Placa J22, J2-3", cable: "24–26 AWG",
    filas: [["J20 J1-6", "J22 J2-3", "relé → R1 220 Ω → chasis J22-19"]],
    notas: ["Con la CRT encendida la línea queda en 5 V; apagada, en GND.", "La resistencia ya está en la J22: no agregues otra."] },
  { id: "c_spk", cat: "Audio", titulo: "Parlantes", ruta: "indiv", desde: "PAM8403, salidas", hacia: "Placa J22, J2-7 a J2-10", cable: "22 AWG, 4 hilos, respeta la polaridad",
    filas: [["L−", "J22 J2-7", "chasis J22-16"], ["L+", "J22 J2-8", "chasis J22-14"], ["R−", "J22 J2-9", "chasis J22-15"], ["R+", "J22 J2-10", "chasis J22-13"]],
    notas: ["El PAM8403 es [[BTL]]: las salidas «−» **no son GND**. No las unas entre sí ni a tierra.", "La J22 no amplifica; solo lleva estos cables a los parlantes originales de 28 mm y 4 Ω."] },
  { id: "c_amp5", cat: "Energía DC", titulo: "+5 V al amplificador", ruta: "indiv", desde: "Placa Down Converter, J1-6 y J1-2", hacia: "PAM8403, VCC y GND", cable: "22 AWG",
    filas: [["DC J1-6 +5 V", "VCC", ""], ["DC J1-2 GND", "GND", ""]],
    notas: ["Usa la segunda borna de +5 V y GND para no empalmar con la línea de la Pi."] },
  { id: "c_pi5v", cat: "Energía DC", titulo: "+5 V a la Raspberry Pi 5", ruta: "indiv", si: { alim: ["A"] }, desde: "Placa Down Converter, J1-5 y J1-1", hacia: "Raspberry Pi 5, pines 2, 4 y 6 (GPIO)", cable: "18–20 AWG, lo más corto posible",
    filas: [["DC J1-5 +5 V", "Pi pin 2 y pin 4", "ideal: un cable a cada pin"], ["DC J1-1 GND", "Pi pin 6", ""]],
    notas: ["Riel conmutado: la Pi enciende y se apaga junto con la CRT.", "Por GPIO no hay negociación USB-PD. Agrega `usb_max_current_enable=1` solo si el riel entrega 5 A reales.", "Valida bajo carga: `vcgencmd get_throttled` debe devolver `0x0`."] },
  { id: "c_pi5v_alt", cat: "Energía DC", titulo: "Alimentación alternativa de la Pi", ruta: "ambas", si: { alim: ["B", "C", "D", "F"] }, desde: "Según la opción elegida", hacia: "Raspberry Pi 5", cable: "Ver «Herramientas → Alimentación Pi 5»",
    filas: [["Opción B", "DC J1-10 (+15 V standby) → módulo DC-DC → 5 V → Pi", ""], ["Opción C", "DC J1-5/J1-1 → USB-C (solo VBUS y GND)", ""], ["Opción D", "DC J1-3/4 (+12 V) → buck → USB-C", ""], ["Opción F", "Cargador oficial a la pared; botón en paralelo al header J2 de la Pi", ""]],
    notas: ["No conectes también el +5 V por GPIO: **nunca dos fuentes a la vez** sobre la Pi.", "Detalle de cada opción en la herramienta de alimentación."] },

  /* --- Ambas rutas --- */
  { id: "c_vga", cat: "Video", titulo: "Video VGA", ruta: "ambas", desde: "Adaptador HDMI→VGA", hacia: "Placa J20, J4 (DB15 hembra)", cable: "VGA macho-macho corto, con ferrita",
    filas: [["DB15-1 / 2 / 3", "Rojo / verde / azul", "chasis J20-17 / 15 / 13"], ["DB15-13", "H-SYNC", "chasis J20-9"], ["DB15-14", "V-SYNC", "chasis J20-11 y D10 (JP3)"], ["DB15-5…8, 10", "GND", "GND de video"], ["DB15-12 / 15", "DDC (EDID)", "ATmega A4 / A5 vía JP1 / JP2"], ["DB15-9", "+5 V del equipo", "ATmega vía D2"]],
    notas: ["**Suelda JP3**: el ATmega vigila VSYNC y apaga la CRT tras ~3 minutos sin señal.", "JP1 y JP2 activan el [[EDID]] del iMac, pero casi ningún adaptador lo reenvía a la Pi. Por eso el modo se fuerza en `cmdline.txt`."] },
  { id: "c_hdmi", cat: "Video", titulo: "HDMI de la Pi al adaptador", ruta: "ambas", desde: "Raspberry Pi 5, micro-HDMI 0", hacia: "Adaptador, entrada HDMI", cable: "micro-HDMI a HDMI corto o adaptador rígido",
    filas: [["micro-HDMI 0", "HDMI in", "video + audio digital"]],
    notas: ["Modo 1024×768 a 75 Hz. La CRT solo acepta los modos de su EDID (1024×768@75, 800×600@95, 640×480@117), todos cerca de 60 kHz horizontal; 1024×768 a 60 Hz queda fuera."] },
  { id: "c_usb", cat: "Energía DC", titulo: "Alimentación del adaptador", ruta: "ambas", si: { usbad: [true] }, desde: "Raspberry Pi 5, USB-A", hacia: "Adaptador, entrada micro-USB o USB-C", cable: "Cable USB corto",
    filas: [["USB-A", "USB 5 V", "solo energía"]], notas: ["Solo si tu adaptador tiene entrada de alimentación. Muchos la necesitan para que el audio salga estable."] },
  { id: "c_audio", cat: "Audio", titulo: "Audio analógico al amplificador", ruta: "indiv", desde: "Adaptador, jack 3,5 mm", hacia: "PAM8403, entradas L, R y GND", cable: "Cable 3,5 mm blindado de 3 hilos",
    filas: [["Punta", "L in", ""], ["Anillo", "R in", ""], ["Manga", "GND", ""]],
    notas: ["Si el adaptador no tiene jack, intercala un extractor de audio HDMI entre la Pi y el adaptador.", "Si escuchas zumbido, une el GND de entrada al GND del amplificador en un solo punto (ver «Diagnóstico»)."] },
  { id: "c_uart", cat: "Datos", titulo: "Ajuste de imagen por serial", ruta: "indiv", si: { uart: [true] }, desde: "Placa J20, headers J5 y J3", hacia: "Raspberry Pi 5, pines 8, 10 y 14", cable: "26 AWG, 3 hilos y dos resistencias",
    filas: [["J20 J5-5 TX (5 V)", "Pi pin 10 GPIO15 RXD", "1 kΩ en serie y 2 kΩ a GND"], ["Pi pin 8 GPIO14 TXD", "J20 J5-3 RX", "directo"], ["Pi pin 14 GND", "J20 J3-6 GND", "referencia del serial"]],
    notas: ["**Sin el divisor, los 5 V del ATmega pueden dañar la GPIO de la Pi.**", "J5 no tiene GND: toma la referencia de J3-6.", "115200 baudios en `/dev/ttyAMA0`."] },
  { id: "c_amber", cat: "Control", titulo: "LED ámbar desde la Pi", ruta: "indiv", si: { ambar: [true] }, desde: "Raspberry Pi 5, pin 16 (GPIO23)", hacia: "Placa J22, J2-5", cable: "26 AWG",
    filas: [["Pi pin 16 GPIO23", "J22 J2-5", "R2 220 Ω → chasis J22-20"]],
    notas: ["No está en el diseño original: es una propuesta para usar el LED ámbar como indicador.", "La resistencia ya está en la J22; con 3,3 V circulan unos 5 mA."] },

  /* --- Solo master --- */
  { id: "m_j22", cat: "Cables cortos (master)", titulo: "Bornera J2 de la J22 ↔ terminal T_J22_J2", ruta: "master", desde: "Placa J22, bornera J2 (10)", hacia: "Master, terminal T_J22_J2 (10)", cable: "10 hilos cortos (~15 mm), mismo número de pin",
    filas: [["J2-1…10", "T_J22_J2-1…10", "pin a pin"]], notas: ["Cada terminal del master lleva serigrafía de número y función por pin."] },
  { id: "m_j20a", cat: "Cables cortos (master)", titulo: "Bornera J1 de la J20 ↔ terminal T_J20_J1", ruta: "master", desde: "Placa J20, bornera J1 (6)", hacia: "Master, terminal T_J20_J1 (6)", cable: "6 hilos cortos (~15 mm)",
    filas: [["J1-1…6", "T_J20_J1-1…6", "pin a pin"]], notas: ["Los bornes 2 (line sense), 3 (−10 V) y 4 (PROT) de la J20 no tienen destino en el master: déjalos libres."] },
  { id: "m_j20b", cat: "Cables cortos (master)", titulo: "Header J5 de la J20 ↔ terminal T_J20_J5", ruta: "master", desde: "Placa J20, header J5 (2×3)", hacia: "Master, T_J20_J5 (2×3)", cable: "6 hilos o cable plano corto",
    filas: [["J5-1…6", "T_J20_J5-1…6", "pin a pin"]], notas: ["El divisor 1 kΩ / 2 kΩ del UART ya está soldado en el master (R_DIV1, R_DIV2)."] },
  { id: "m_dc1", cat: "Cables cortos (master)", titulo: "Bornera J1 del Down Converter ↔ T_DC_J1", ruta: "master", desde: "Placa Down Converter, bornera J1 (10)", hacia: "Master, terminal T_DC_J1 (10)", cable: "10 hilos cortos (~15 mm); los de potencia, de mayor sección",
    filas: [["J1-1…10", "T_DC_J1-1…10", "pin a pin"]], notas: ["Los pines 5 y 6 (+5 V) están unidos en el master con una pista de 1 mm."] },
  { id: "m_dc2", cat: "Cables cortos (master)", titulo: "Bornera J2 del Down Converter ↔ T_DC_J2", ruta: "master", desde: "Placa Down Converter, bornera J2 (4)", hacia: "Master, terminal T_DC_J2 (4)", cable: "4 hilos cortos (~15 mm)",
    filas: [["J2-1…4", "T_DC_J2-1…4", "pin a pin"]], notas: ["Aquí llegan 24 VAC (por las pistas del master) y DCO."] },
  { id: "m_audio", cat: "Audio", titulo: "Audio del adaptador al master", ruta: "master", desde: "Adaptador, jack 3,5 mm", hacia: "Master, J_AUDIO_IN (1×3: L, GND, R)", cable: "Cable 3,5 mm blindado de 3 hilos",
    filas: [["Punta", "J_AUDIO_IN-1 (L)", ""], ["Manga", "J_AUDIO_IN-2 (GND)", ""], ["Anillo", "J_AUDIO_IN-3 (R)", ""]],
    notas: ["El PAM8403 (módulo) va montado sobre el master: sus +5 V, GND y salidas a parlantes ya están ruteadas."] },
  { id: "m_gpio", cat: "Datos", titulo: "GPIO de la Pi ↔ J_PI_GPIO", ruta: "master", desde: "Raspberry Pi 5, fila par de pines 2–16", hacia: "Master, J_PI_GPIO (1×8)", cable: "8 hilos o conector Dupont 1×8",
    filas: [["pines 2 y 4", "+5 V", "alimentación de la Pi (opción A)"], ["pin 6", "GND", ""], ["pin 8 (GPIO14 TXD)", "SERIAL_RX", "a J20 J5-3"], ["pin 10 (GPIO15 RXD)", "PI_RXD", "desde J5-5 vía divisor"], ["pin 12", "sin conexión", ""], ["pin 14", "GND", "referencia del serial"], ["pin 16 (GPIO23)", "LED ámbar", "a J22 J2-5"]],
    notas: ["El master asume la **opción A** (alimentación por GPIO). Con otra opción, no conectes los pines 2 y 4.", "Es la única conexión de datos y energía entre la Pi y el master."] }
];

/* ---------- Pines ---------- */
MB.PINES = [
  { id: "j20c", titulo: "Arnés J20 del chasis (20 pines)", sub: "Se enchufa a la placa J20, header J2 (cara inferior).", cab: ["Pin", "Señal", "En la placa J20"],
    filas: [["1", "SDA IVAD", "ATmega D4 (pin 6)"], ["2", "SCL IVAD", "ATmega D5 (pin 11)"], ["3, 4", "GND", "GND"], ["5", "DCO", "J1-5"], ["6", "5 V trickle", "ATmega (D1), relé, J3-2"], ["7", "PROT", "J1-4, 10 kΩ a GND"], ["8", "−10 V", "J1-3"], ["9", "H-SYNC", "J4-13"], ["10", "PFW", "relé LCC110"], ["11", "V-SYNC", "J4-14, D10 vía JP3"], ["12", "LPIACT: L1 LP", "relé LCC110, J1-6"], ["13", "Azul", "J4-3"], ["14", "GND azul", "GND"], ["15", "Verde", "J4-2"], ["16", "GND verde", "GND"], ["17", "Rojo", "J4-1"], ["18", "GND rojo", "GND"], ["19", "Line sense", "J1-2"], ["20", "GND", "GND"]] },
  { id: "j22c", titulo: "Arnés J22 del chasis (26 pines)", sub: "Se enchufa a la placa J22, header J1 (cara inferior).", cab: ["Pin", "Señal", "En la placa J22"],
    filas: [["1, 2", "Mic − y blindaje", "GND"], ["3", "Mic +", "JP2 → jack J3"], ["4, 11", "GND audífonos", "GND"], ["5", "H2 derecho", "J4-1"], ["6", "H2 izquierdo", "J4-2"], ["7", "H2 sense", "J4-3"], ["8", "H1 sense", "J4-4"], ["9", "H1 derecho", "J4-5"], ["10", "H1 izquierdo", "J4-6"], ["12, 21, 22", "NC", "—"], ["13", "+ parlante derecho", "J2-10"], ["14", "+ parlante izquierdo", "J2-8"], ["15", "− parlante derecho", "J2-9"], ["16", "− parlante izquierdo", "J2-7"], ["17", "Botón", "J2-4"], ["18", "Común botón y LEDs", "GND"], ["19", "LED verde", "R1 220 Ω → J2-3"], ["20", "LED ámbar", "R2 220 Ω → J2-5"], ["23, 25", "AC −", "J2-2"], ["24, 26", "AC +", "J2-1"]] },
  { id: "pav", titulo: "PAV J7 (24 pines)", sub: "Numeración Molex del esquemático; entre paréntesis, la de LG/Apple.", cab: ["Molex (LG)", "Señal", "En la placa DC"],
    filas: [["1 (1)", "+3,3 V", "J1-7/8"], ["2 (3), 3 (5)", "GND", "J1-1/2"], ["4 (7)", "PT", "J2-2"], ["5 (9)", "DCO", "J2-1"], ["6 (11), 7 (13)", "GND", "J1-1/2"], ["8 (15), 9 (17)", "AC −", "J2-3"], ["10 (19), 11 (21)", "AC +", "J2-4"], ["12 (23)", "+15 V standby, +24 V encendido", "J1-10"], ["13 (2)", "+12 V", "J1-3/4"], ["14 (4), 15 (6)", "+5 V", "J1-5/6"], ["16 (8), 17 (10)", "GND", "J1-1/2"], ["18–21 (12–18)", "+3,3 V", "J1-7/8"], ["22 (20)", "+8 V standby, +12 V encendido", "J1-9"], ["23 (22)", "GND", "J1-1/2"], ["24 (24)", "+5 V", "J1-5/6"]] },
  { id: "j20j1", titulo: "Placa J20 · J1, bornera de 6", sub: "De izquierda a derecha en la serigrafía: LED, DCO, PROT, −10 V, SENSE, botón.", cab: ["Borne", "Señal", "Conecta con"],
    filas: [["1", "Botón (D3, pull-up 10 kΩ)", "J22 J2-4"], ["2", "Line sense", "libre"], ["3", "−10 V", "libre"], ["4", "PROT (5 V apaga todo)", "libre"], ["5", "DCO", "DC J2-1"], ["6", "LED de encendido", "J22 J2-3"]] },
  { id: "j20j4", titulo: "Placa J20 · J4, VGA DB15 hembra", sub: "Entrada de video desde el adaptador.", cab: ["Pin", "Señal", "Destino"],
    filas: [["1 / 2 / 3", "Rojo / verde / azul", "chasis J20-17 / 15 / 13"], ["4, 11", "NC", "—"], ["5–8, 10", "GND", "GND"], ["9", "+5 V del equipo", "ATmega vía D2"], ["12", "SDA DDC", "ATmega A4 vía JP1"], ["13", "H-SYNC", "chasis J20-9"], ["14", "V-SYNC", "chasis J20-11, D10 vía JP3"], ["15", "SCL DDC", "ATmega A5 vía JP2"]] },
  { id: "j20j5", titulo: "Placa J20 · J5, header 2×3", sub: "Serial y pines libres del ATmega. Niveles de 5 V.", cab: ["Pin", "Señal", "Uso"],
    filas: [["1", "SDA equipo (A4)", "EDID"], ["2", "SCL equipo (A5)", "EDID"], ["3", "RX serial (D0)", "← Pi pin 8"], ["4", "PB0 (D8)", "libre"], ["5", "TX serial (D1)", "→ divisor → Pi pin 10"], ["6", "PB1 (D9)", "libre"]] },
  { id: "j20j3", titulo: "Placa J20 · J3, programación ISP", sub: "Arduino Uno con el sketch ArduinoISP. La placa se alimenta del 5 V trickle del iMac (el diagrama no conecta 5 V).", cab: ["J3", "Señal", "Arduino Uno"],
    filas: [["1", "MISO", "D12"], ["2", "5 V trickle", "no conectar"], ["3", "SCK", "D13"], ["4", "MOSI", "D11"], ["5", "RESET", "D10"], ["6", "GND", "GND (y referencia del UART)"]] },
  { id: "j20rel", titulo: "Placa J20 · relé LCC110 y jumpers", sub: "Relé de estado sólido 1 Form C (esquemático Rev 3).", cab: ["Ref.", "Función", "Nota"],
    filas: [["U2-2 / 3", "LED del relé", "D7 y R4 220 Ω a GND"], ["U2-5 (NO)", "5 V trickle", "se une al común con D7 en alto"], ["U2-6 / 7 (común)", "PFW, LPIACT, J1-6", "chasis J20-10 y 12"], ["U2-8 (NC)", "GND", "mantiene la CRT apagada en reposo"], ["JP1 / JP2", "VGA 12 / 15 ↔ A4 / A5", "EDID"], ["JP3", "V-SYNC ↔ D10", "suéldalo"], ["J2 2×10", "header al arnés", "cara inferior"]] },
  { id: "j22j2", titulo: "Placa J22 · J2, bornera de 10", sub: "Orden de la serigrafía, de izquierda a derecha.", cab: ["Borne", "Señal", "Conecta con"],
    filas: [["1", "+AC", "DC J2-4"], ["2", "−AC", "DC J2-3"], ["3", "LED verde (220 Ω)", "J20 J1-6"], ["4", "Botón", "J20 J1-1"], ["5", "LED ámbar (220 Ω)", "libre o Pi pin 16"], ["6", "GND", "libre"], ["7", "− izquierdo", "amp. L−"], ["8", "+ izquierdo", "amp. L+"], ["9", "− derecho", "amp. R−"], ["10", "+ derecho", "amp. R+"]] },
  { id: "j22j4", titulo: "Placa J22 · J4, audífonos frontales", sub: "Salidas hacia los jacks del chasis.", cab: ["Pin", "Señal"],
    filas: [["1", "H2 derecho"], ["2", "H2 izquierdo"], ["3", "H2 sense"], ["4", "H1 sense"], ["5", "H1 derecho"], ["6", "H1 izquierdo"]] },
  { id: "j22mic", titulo: "Placa J22 · micrófono, J3 y jumpers", sub: "Solo si usas el micrófono del chasis con una tarjeta de sonido USB. Los pads están en la cara inferior.", cab: ["Modo o ref.", "Qué soldar o qué hace"],
    filas: [["Con circuito (electret)", "JP1 y JP2 pads 1–2"], ["Directo al equipo", "JP2 pads 2–3, JP1 abierto"], ["JP3", "solo para probar 5 V: no lo sueldes"], ["J3 punta", "señal del micrófono"], ["J3 anillo", "polarización (R3 2,2 kΩ, C1 1 µF)"], ["J3 manga", "GND"], ["J1 2×13", "header al arnés, cara inferior"]] },
  { id: "dcj1", titulo: "Placa Down Converter · J1, bornera de 10", sub: "Rieles de salida.", cab: ["Borne", "Riel", "Uso propuesto"],
    filas: [["1", "GND", "Pi pin 6"], ["2", "GND", "amplificador"], ["3, 4", "+12 V", "libre"], ["5", "+5 V", "Pi pines 2 y 4"], ["6", "+5 V", "amplificador"], ["7, 8", "+3,3 V", "libre"], ["9", "+8 V standby, +12 V encendido", "libre"], ["10", "+15 V standby, +24 V encendido", "opción B de alimentación"]] },
  { id: "dcj2", titulo: "Placa Down Converter · J2, bornera de 4", sub: "En la serigrafía: +AC, −AC, PT, DCO.", cab: ["Borne", "Señal", "Conecta con"],
    filas: [["1", "DCO", "J20 J1-5"], ["2", "PT", "libre"], ["3", "−AC", "J22 J2-2"], ["4", "+AC", "J22 J2-1"]] },
  { id: "dcfan", titulo: "Placa Down Converter · ventilador", sub: "Header de 4 pines con PWM y tacómetro en puntos de prueba.", cab: ["Ref.", "Función"],
    filas: [["M1-1", "GND"], ["M1-2", "V ventilador (JP1)"], ["M1-3 / TP1", "tacómetro"], ["M1-4 / TP2", "PWM"], ["JP1", "puente a +5 V o a +12 V"]] },
  { id: "pi5", titulo: "Raspberry Pi 5 · GPIO y puertos usados", sub: "Propuesta para esta integración.", cab: ["Pin / puerto", "Función", "Conecta con"],
    filas: [["2, 4", "+5 V", "DC J1-5"], ["6", "GND", "DC J1-1"], ["8 (GPIO14)", "TXD", "J20 J5-3 (opcional)"], ["10 (GPIO15)", "RXD", "divisor ← J20 J5-5 (opcional)"], ["14", "GND", "J20 J3-6 (opcional)"], ["16 (GPIO23)", "LED ámbar", "J22 J2-5 (opcional)"], ["micro-HDMI 0", "video y audio", "adaptador HDMI→VGA"], ["USB-A", "energía", "adaptador, si la pide"], ["USB-C", "libre", "la Pi se alimenta por GPIO"]] }
];

/* ---------- Jumpers de soldadura ---------- */
MB.JUMPERS = [
  { id: "j20_edid", placa: "J20", nombre: "JP1 y JP2 · EDID por DDC", rec: "Recomendado soldar", pads: [[2, "JP1", "DB15-12 (SDA) ↔ ATmega A4"], [2, "JP2", "DB15-15 (SCL) ↔ ATmega A5"]], modos: [{ t: "Soldar ambos (recomendado)", p: [[1, 2], [1, 2]] }, { t: "Dejar abiertos", p: [[], []] }],
    que: "El VGA lleva dos líneas extra, SDA y SCL (pines 12 y 15 del DB15), llamadas [[DDC]]. Por ahí un monitor le dice al equipo su resolución nativa ([[EDID]]). Estos jumpers deciden si esas líneas quedan conectadas al ATmega para que responda ese EDID.",
    nota: "Sin ellos el equipo no recibe EDID por el cable VGA y depende de lo que fuerces en `cmdline.txt`. La mayoría de los adaptadores HDMI→VGA no reenvían ese EDID a la Pi, así que el efecto práctico es chico, pero soldarlos no tiene contras." },
  { id: "j20_vsync", placa: "J20", nombre: "JP3 · apagado automático por VSYNC", rec: "Soldar siempre", pads: [[2, "JP3", "V-SYNC ↔ ATmega D10"]], modos: [{ t: "Soldar (obligatorio)", p: [[1, 2]] }],
    que: "Une la señal V-SYNC del VGA con el pin D10 del ATmega. Es lo que le permite contar pulsos de sincronismo vertical y notar cuándo el equipo dejó de mandar video.",
    nota: "**Obligatorio.** Sin él la CRT nunca se apaga sola: solo con el botón. El firmware apaga la CRT unos 3 minutos después de que la Pi deja de enviar imagen (por ejemplo, tras `sudo poweroff`)." },
  { id: "j22_mic", placa: "J22", nombre: "JP1, JP2 y JP3 · micrófono", rec: "Solo si usarás el micrófono", pads: [[2, "JP1", "polarización del electret"], [3, "JP2", "1–2 con circuito · 2–3 directo"], [2, "JP3", "solo pruebas de 5 V"]],
    modos: [{ t: "Con circuito (recomendado)", p: [[1, 2], [1, 2], []] }, { t: "Directo al equipo", p: [[], [2, 3], []] }, { t: "No uso el micrófono", p: [[], [], []] }],
    que: "El micrófono del chasis es un electret: necesita un voltaje de polarización que normalmente entrega la entrada de micrófono del equipo. JP1 y JP2 configuran cómo llega; JP3 es solo para pruebas.",
    nota: "Con circuito: interfaz USB o tarjeta de sonido con entrada de micrófono estándar. Directo: si tu interfaz ya polariza el micrófono. **JP3 no se suelda.** Si no usas el micrófono, deja J3, R3, C1 y los tres jumpers sin soldar y sin instalar. JP2 tiene 3 pastillas: nunca puentees ambos lados a la vez." },
  { id: "dc_fan", placa: "Down Converter", nombre: "JP1 · voltaje del ventilador", rec: "Elige un solo lado", pads: [[3, "JP1", "1 = +5 V · 2 = ventilador · 3 = +12 V"]],
    modos: [{ t: "Ventilador de 5 V", p: [[1, 2]] }, { t: "Ventilador de 12 V", p: [[2, 3]] }, { t: "Sin ventilador", p: [[]] }],
    que: "El header de 4 pines (M1) necesita un voltaje. JP1 tiene 3 pastillas: la del medio va al pin de alimentación del ventilador y decides si recibe +5 V o +12 V.",
    nota: "Revisa el voltaje nominal de tu ventilador. **Nunca sueldes los dos lados a la vez:** pondrías 5 V y 12 V en corto. Para cambiar luego, retira el estaño con malla desoldadora." }
];

/* ---------- Alimentación de la Pi 5 ---------- */
MB.ALIM = [
  { id: "A", n: "GPIO directo desde +5 V conmutado", riel: "+5 V conmutado (down converter)", pd: "Sí", apaga: "Sí, de golpe", comp: "Baja", tag: "Por defecto",
    txt: "DC J1-5 (+5 V) a los pines 2 y 4 de la Pi y DC J1-1 (GND) al pin 6. Sin módulos extra: la Pi enciende con la CRT. Apaga siempre con `sudo poweroff` y deja que la CRT se apague sola.",
    pro: ["Sin módulos", "Es el método que usa el resto de la guía y el PCB master"], con: ["Pulsar el botón con la Pi encendida le corta la energía de golpe", "Sin negociación USB-PD: la Pi limita los puertos USB salvo `usb_max_current_enable=1`"] },
  { id: "B", n: "Reductor DC-DC desde +15 V standby", riel: "+15 V standby", pd: "Sí", apaga: "No", comp: "Media", tag: "",
    txt: "DC J1-10 → módulo DC-DC (por ejemplo XY-3606) → 5 V estables → Pi. La Pi puede quedar encendida con la CRT apagada.",
    pro: ["La Pi sigue viva con la CRT apagada"], con: ["La capacidad del standby es desconocida y la línea **sube a 24 V al encender**: verifica el rango de entrada del módulo y mide antes"] },
  { id: "C", n: "USB-C directo desde el down converter", riel: "+5 V conmutado (down converter)", pd: "Sí", apaga: "Sí, de golpe", comp: "Baja", tag: "",
    txt: "Mismo riel que A, entregado por el USB-C en vez de GPIO: usa solo VBUS y GND; D+/D− y CC quedan sin conectar. Sin chip PD la Pi asume 5 V/3 A y limita los USB a 600 mA, con aviso de energía limitada.",
    pro: ["Solo cambia el conector"], con: ["Mismo aviso de energía limitada", "Sin PD: ajusta `PSU_MAX_CURRENT=3000` en el EEPROM del bootloader o `usb_max_current_enable=1`"] },
  { id: "D", n: "Buck a USB-C desde +12 V", riel: "+12 V (conmutado o standby)", pd: "Sí", apaga: "Según el riel", comp: "Media", tag: "",
    txt: "Un buck genérico (sin PD) baja +12 V a 5 V y lo entrega por USB-C. Elige un módulo de al menos 5 V/3 A con buen rizado. Si el +12 V es conmutado, la Pi se apaga con la CRT; si lo tomas del standby, queda encendida.",
    pro: ["Parte de un riel con más margen que el +5 V ya regulado"], con: ["Sigue sin haber negociación PD", "Un módulo más que cablear"] },
  { id: "E", n: "Módulo fuente PD", riel: "Cualquier riel DC", pd: "Normalmente sí", apaga: "Depende del riel", comp: "Alta", tag: "No recomendada",
    txt: "Un chip fuente PD real negocia con la Pi como un cargador, pero casi ningún módulo comercial implementa el perfil 5 V/5 A que pide la Pi 5. En la práctica sueles quedar en 5 V/3 A con el mismo aviso.",
    pro: ["Negociación PD real"], con: ["Muy poco común, mucho esfuerzo, poco beneficio"] },
  { id: "F", n: "Cargador oficial independiente + botón sincronizado", riel: "Red eléctrica (independiente)", pd: "No", apaga: "No: apagado por software", comp: "Media", tag: "La más robusta",
    txt: "El cargador oficial va a la pared. La Pi queda siempre alimentada; el botón del iMac enciende la CRT y, en paralelo, dispara el encendido/apagado por software de la Pi. Cablea un segundo hilo desde el contacto del botón (o J22 J2-4) a un lado del header J2 de la Pi 5; el otro lado de J2 va a GND. Es pasivo: no interfiere con lo que lee el ATmega.",
    pro: ["Sin cortes bruscos", "Alimentación completa, sin aviso de energía limitada"], con: ["Usa Raspberry Pi OS **Lite** para que un solo toque apague todo; en Desktop apagar pide un segundo toque", "El apagado de la CRT por falta de VSYNC sigue funcionando"] }
];
MB.ALIM_EVENTOS_F = [["1er toque, todo apagado", "enciende (secuencia normal del ATmega)", "J2 recibe el mismo toque → arranca"], ["2.º toque, todo encendido", "apaga la CRT de inmediato", "J2 pide apagado de software (sin corte brusco)"], ["Pi termina de apagarse", "sin cambios", "queda «apagada pero alimentada», lista para el próximo toque"]];

/* ---------- Secuencia de encendido ---------- */
MB.SECUENCIA = [
  { t: "Reposo", x: "Con el iMac enchufado, la placa analógica entrega 5 V trickle al ATmega y 24 VAC al down converter. Solo están activos los rieles standby." },
  { t: "Presionas el botón", x: "La señal va de J22 J2-4 a J20 J1-1 y llega al pin D3 del ATmega. El firmware actúa cuando lo **sueltas**." },
  { t: "Relé y LED verde", x: "D7 activa el relé LCC110, que une el 5 V trickle con PFW y LPIACT (chasis J20-10 y 12). La CRT enciende y el LED verde se prende por J20 J1-6 → J22 J2-3." },
  { t: "DCO habilita energía", x: "La placa analógica activa DCO (chasis J20-5). Pasa por J20 J1-5 a la placa down converter y el PAV habilita +3,3, +5 y +12 V." },
  { t: "Inicialización del IVAD", x: "500 ms después, el ATmega envía la secuencia I²C por D4 y D5 (chasis J20-1 y 2; direcciones 0x46 y 0x53) y carga los ajustes guardados." },
  { t: "Arrancan la Pi y el amplificador", x: "El +5 V llega a los pines 2 y 4 de la Pi y al PAM8403. La Pi tarda unos segundos en sacar imagen; el ATmega le da hasta 3 minutos." },
  { t: "Imagen", x: "HDMI → adaptador → VGA → J20 J4 → chasis J20 (RGB en 13, 15 y 17; sync en 9 y 11). El ATmega empieza a contar pulsos de VSYNC." },
  { t: "Sonido", x: "Audio del adaptador → PAM8403 → J22 J2-7 a J2-10 → parlantes (chasis J22-13 a 16)." },
  { t: "Apagado", x: "Apaga la Pi con `sudo poweroff`. Sin VSYNC, el ATmega apaga la CRT y los rieles en unos 3 minutos. Si presionas el botón con la Pi encendida, le cortas la energía de golpe." }
];

/* ---------- Teclas de calibración ---------- */
MB.TECLAS = [
  ["a", "s", "Posición horizontal", "izquierda", "derecha", "x"],
  ["w", "z", "Posición vertical", "arriba", "abajo", "y"],
  ["d", "f", "Ancho", "más estrecho", "más ancho", "w"],
  ["r", "c", "Alto", "más alto", "más bajo", "h"],
  ["g", "h", "Contraste", "menos", "más", "con"],
  ["j", "k", "Brillo", "menos", "más", "bri"],
  ["x", "v", "Paralelogramo", "inclina a la izquierda", "inclina a la derecha", "par"],
  ["b", "n", "Keystone (trapecio)", "estrecha arriba", "estrecha abajo", "key"],
  ["t", "y", "Rotación", "antihorario", "horario", "rot"],
  ["u", "i", "Pincushion (cojín)", "expande esquinas", "contrae esquinas", "pin"]
];

/* ---------- Modos de video ---------- */
MB.MODOS = [
  { id: "1024", nombre: "1024×768 a 75 Hz", cmd: "video=HDMI-A-1:1024x768@75D", alt: "video=HDMI-A-1:1024x768M@75D", modeline: "Modeline \"1024x768\" 78.75 1024 1044 1140 1328 768 781 784 820 +hsync +vsync ratio=4:3", rec: true },
  { id: "800", nombre: "800×600 a 95 Hz", cmd: "video=HDMI-A-1:800x600@95D", alt: "video=HDMI-A-1:800x600M@95D", modeline: "Modeline \"800x600\" 62.40 800 821 901 1040 600 609 612 644 +hsync +vsync ratio=4:3" },
  { id: "640", nombre: "640×480 a 117 Hz", cmd: "video=HDMI-A-1:640x480@117D", alt: "video=HDMI-A-1:640x480M@117D", modeline: "Modeline \"640x480\" 49.90 640 657 721 832 480 481 484 514 +hsync +vsync ratio=4:3" }
];

/* ---------- Multímetro ---------- */
MB.MEDIDAS = [
  { id: "m1", t: "5 V trickle", cond: "iMac enchufado, CRT apagada", rojo: "J20 J3-2", negro: "J20 J3-6", modo: "VDC", nom: 5, min: 4.75, max: 5.25, tol: "±5 %", fallo: "sin_trickle" },
  { id: "m2", t: "24 VAC de la placa analógica", cond: "iMac enchufado", rojo: "J22 J2-1", negro: "J22 J2-2", modo: "VAC", nom: 24, min: 20.4, max: 27.6, tol: "orientativo ±15 %", fallo: "sin_ac" },
  { id: "m3", t: "+3,3 V", cond: "tras pulsar el botón (CRT encendida)", rojo: "DC J1-7", negro: "DC J1-1", modo: "VDC", nom: 3.3, min: 3.135, max: 3.465, tol: "±5 %", fallo: "sin_rieles" },
  { id: "m4", t: "+5 V", cond: "tras pulsar el botón", rojo: "DC J1-5", negro: "DC J1-1", modo: "VDC", nom: 5, min: 4.75, max: 5.25, tol: "±5 %", fallo: "sin_rieles" },
  { id: "m5", t: "+12 V", cond: "tras pulsar el botón", rojo: "DC J1-3", negro: "DC J1-1", modo: "VDC", nom: 12, min: 11.4, max: 12.6, tol: "±5 %", fallo: "sin_rieles" },
  { id: "m6", t: "+5 V con carga", cond: "con carga resistiva y MIN/MAX HOLD (mira el mínimo)", rojo: "DC J1-5", negro: "DC J1-1", modo: "VDC", nom: 5, min: 4.75, max: 5.25, tol: "mínimo ≥ 4,75 V", fallo: "pi_throttle" }
];

/* ---------- Diagnóstico ---------- */
MB.DIAG = [
  { id: "sin_boton", s: "La CRT no enciende al pulsar el botón", causas: [
    { t: "El botón no llega al ATmega", c: "Revisa el cable J22 J2-4 → J20 J1-1. Con el multímetro en continuidad, al pulsar el botón debe cerrarse entre J20 J1-1 y GND." },
    { t: "No hay 5 V trickle", c: "Mide 5 V entre J20 J3-2 y J3-6 con el iMac enchufado. Si no hay, el arnés J20 no está bien enchufado o hay un problema en la placa analógica." },
    { t: "ATmega sin programar o mal puesto", c: "Revisa que el chip esté en el zócalo con la muesca en el sentido de la serigrafía y que lo programaste (fase 5). Un cristal Y1 de 16 MHz mal soldado también lo deja mudo." },
    { t: "Header J2 de la J20 al revés o desalineado", c: "Compara la posición del pin 1 con la serigrafía y con el arnés; revisa que no quedó un pin sin insertar." },
    { t: "Relé LCC110 al revés", c: "Revisa la muesca del U2 contra la serigrafía." }] },
  { id: "sin_led", s: "El LED verde no se enciende", causas: [
    { t: "Falta el cable del LED", c: "J20 J1-6 → J22 J2-3. La resistencia de 220 Ω ya está en la J22." },
    { t: "La CRT no está encendiendo", c: "Si tampoco suena la CRT, ve primero a «La CRT no enciende al pulsar el botón»." }] },
  { id: "sin_trickle", s: "No hay 5 V en J3 de la J20", causas: [
    { t: "iMac sin enchufar o arnés suelto", c: "Enchufa el iMac y revisa que el arnés de 20 pines esté insertado a fondo en el header J2 de la placa." },
    { t: "Cable J20 mal orientado", c: "El pin 6 del arnés lleva el 5 V trickle (J3-2). Si el header está girado 180°, nada llega donde debe." }] },
  { id: "sin_ac", s: "No hay 24 VAC en la J22", causas: [
    { t: "Multímetro en VDC", c: "Es alterna: pon el multímetro en VAC." },
    { t: "Arnés J22 flojo", c: "Los 24 VAC entran por los pines 23–26 del arnés. Reinserta el conector de 26 pines." }] },
  { id: "sin_rieles", s: "Al pulsar el botón no aparecen +3,3 / +5 / +12 V", causas: [
    { t: "Falta el cable de DCO", c: "J20 J1-5 → DC J2-1. Sin él los rieles de potencia no se activan." },
    { t: "Faltan los 24 VAC en el Down Converter", c: "Revisa el par J22 J2-1/J2-2 → DC J2-4/J2-3 y mide VAC en la bornera del DC." },
    { t: "La placa PAV no está bien asentada", c: "Reinserta el PAV en J7 de la placa breakout y revisa que ningún pin del Molex quedó doblado." },
    { t: "PROT activa", c: "PROT (J20 J1-4) en 5 V apaga todo el sistema. Déjalo libre y verifica que no esté en corto a 5 V." }] },
  { id: "sin_imagen", s: "La CRT enciende (se oye) pero la pantalla está negra", causas: [
    { t: "La Pi aún no saca imagen", c: "La Pi tarda unos segundos; el ATmega espera hasta 3 minutos. Mueve el ratón: puede estar en reposo de pantalla." },
    { t: "Modo no aceptado por la CRT", c: "Fuerza `video=HDMI-A-1:1024x768@75D` en `cmdline.txt` (en la misma línea). 1024×768 a 60 Hz queda fuera de rango." },
    { t: "VGA mal conectado", c: "Revisa el cable VGA entre el adaptador y J4 (DB15) y el cable HDMI de la Pi al adaptador." },
    { t: "IVAD no se inicializó", c: "Comprueba que el ATmega está programado y que el cable I²C del arnés (pines 1 y 2) llega a D4/D5. Reinicia la secuencia apagando y encendiendo con el botón." }] },
  { id: "sin_sync", s: "La imagen parpadea, rueda o no sincroniza", causas: [
    { t: "Frecuencia horizontal incorrecta", c: "La CRT solo acepta modos cerca de 60 kHz horizontal. Prueba `1024x768M@75D` (timings CVT) o baja a `800x600@95D`." },
    { t: "Falta la `D` al final del modo", c: "La `D` fuerza el conector como conectado digitalmente: `1024x768@75D`." },
    { t: "Directivas antiguas", c: "Con KMS las directivas `hdmi_*` de config.txt se ignoran: usa cmdline.txt." },
    { t: "Sincronismos mal cableados", c: "H-SYNC = DB15-13 → chasis J20-9; V-SYNC = DB15-14 → chasis J20-11." }] },
  { id: "geometria", s: "La imagen está desplazada, torcida o de otro tamaño", causas: [
    { t: "Falta calibrar", c: "Usa la herramienta de calibración (fase 10): posición, ancho, alto, paralelogramo, keystone, rotación y pincushion." },
    { t: "Los ajustes no se conservan", c: "Las teclas cambian la imagen pero, según el código del firmware, no escriben la EEPROM. Anota los valores con `p` y fíjalos en la secuencia de inicio del sketch (ver fase 10)." }] },
  { id: "colores", s: "Colores raros o falta un color", causas: [
    { t: "RGB cruzado o suelto", c: "Rojo/verde/azul = DB15-1/2/3 → chasis J20-17/15/13." },
    { t: "Retornos de masa", c: "Los GND de los coaxiales (J20-14, 16, 18) deben ir a GND. Revisa el cable VGA y la ferrita." }] },
  { id: "pi_throttle", s: "La Pi se reinicia, se congela o avisa de poca energía", causas: [
    { t: "Caída de tensión en el riel", c: "Mide el +5 V **bajo carga** en los pines de la Pi, con MIN/MAX HOLD. No debe bajar de 4,75 V." },
    { t: "Cables largos o finos", c: "Usa 18–20 AWG, lo más cortos posible, y un cable a cada pin de +5 V (2 y 4)." },
    { t: "Comprueba el estado", c: "`vcgencmd get_throttled` debe devolver `0x0` con CPU y USB bajo carga." },
    { t: "Aviso de energía limitada", c: "Es normal sin negociación PD. `usb_max_current_enable=1` solo si el riel entrega 5 A reales." }] },
  { id: "sin_audio", s: "No se oye nada", causas: [
    { t: "Salida de audio mal elegida", c: "Elige la salida HDMI en el menú de sonido de Raspberry Pi OS." },
    { t: "El adaptador necesita energía", c: "Alimenta el adaptador por USB (cable USB corto desde la Pi)." },
    { t: "Amplificador sin +5 V", c: "DC J1-6 → VCC y DC J1-2 → GND del PAM8403." },
    { t: "Parlantes mal cableados", c: "L−/L+/R−/R+ → J22 J2-7/8/9/10. Prueba con otro audio para descartar el origen." }] },
  { id: "zumbido", s: "Zumbido o ruido en el audio", causas: [
    { t: "Bucle de masa", c: "Une el GND de entrada al GND del amplificador en un solo punto. La guía original recomienda un aislador de bucle de masa en la línea de audio." },
    { t: "Salidas BTL unidas a tierra", c: "Los terminales «−» del PAM8403 no son GND: no los conectes a masa ni entre sí." }] },
  { id: "no_apaga", s: "La CRT no se apaga sola tras apagar la Pi", causas: [
    { t: "JP3 sin soldar", c: "Es obligatorio: une V-SYNC con D10. Sin él solo se apaga con el botón." },
    { t: "Aún no pasan los ~3 minutos", c: "El firmware espera unos 3 minutos sin VSYNC." },
    { t: "El adaptador sigue enviando señal", c: "Algunos adaptadores mantienen sincronismos aunque la Pi esté apagada; en ese caso apaga con el botón." }] },
  { id: "se_apaga_3", s: "La CRT se apaga sola a los pocos minutos de arrancar", causas: [
    { t: "No llega VSYNC", c: "Si no hay imagen estable, el ATmega apaga la CRT tras ~3 minutos. Revisa HDMI, adaptador y V-SYNC (DB15-14 → J20-11 y JP3)." }] },
  { id: "uart_mudo", s: "El serial no responde", causas: [
    { t: "TX y RX", c: "Pi pin 8 (TXD) → J20 J5-3 (RX); J20 J5-5 (TX) → divisor → Pi pin 10 (RXD)." },
    { t: "UART no habilitada", c: "Agrega `dtparam=uart0=on`, reinicia y usa `/dev/ttyAMA0` a 115200. Desactiva la consola serie si la habilitaste." },
    { t: "Sin masa común", c: "Pi pin 14 (GND) → J20 J3-6." },
    { t: "CRT apagada", c: "El firmware solo procesa las teclas con la CRT encendida." }] },
  { id: "corte_boton", s: "Al pulsar el botón con la Pi encendida se apaga de golpe", causas: [
    { t: "Es esperable con la opción A", c: "El +5 V es un riel conmutado: al apagar la CRT se corta la Pi. Apaga siempre con `sudo poweroff` o usa la opción F." }] },
  { id: "humo", s: "Olor a quemado, calentamiento o chispas", causas: [
    { t: "Desenchufa el iMac de inmediato", c: "Después busca cortos entre +5 V y GND en la bornera J1 del Down Converter y puentes de estaño." }] }
];

/* ---------- Compras ---------- */
MB.COMPRAS = [
  { g: "Herramientas", items: [
    { id: "h1", t: "Cautín (con control de temperatura), estaño y flux", n: "" },
    { id: "h2", t: "Multímetro con continuidad, VAC y MIN/MAX", n: "Clave para las fases 8 y 9" },
    { id: "h3", t: "Pulsera antiestática", n: "" },
    { id: "h4", t: "Sonda de descarga para CRT con pinza a tierra", n: "Para descargar el tubo" },
    { id: "h5", t: "Pelacables, alicates, destornilladores", n: "" },
    { id: "h6", t: "Malla desoldadora", n: "Para deshacer jumpers de soldadura" },
    { id: "h7", t: "Termorretráctil o cinta aislante", n: "" },
    { id: "h8", t: "Arduino Uno (para grabar el ATmega)", n: "También sirve como programador ISP" },
    { id: "h9", t: "Adaptador USB a serie TTL (opcional)", n: "Solo si no usarás el UART de la Pi" }
  ] },
  { g: "Módulos y cables", items: [
    { id: "x1", t: "Raspberry Pi 5 (la guía usa la de 4 GB) y tarjeta microSD", n: "" },
    { id: "x2", t: "Adaptador HDMI→VGA", n: "Ideal con salida de audio 3,5 mm", si: { jack: [true] } },
    { id: "x2b", t: "Adaptador HDMI→VGA y extractor de audio HDMI", n: "Tu adaptador no tiene jack", si: { jack: [false] } },
    { id: "x3", t: "Cable micro-HDMI a HDMI corto (o adaptador rígido)", n: "" },
    { id: "x4", t: "Cable VGA macho-macho corto, con ferrita", n: "" },
    { id: "x5", t: "Módulo amplificador PAM8403 (5 V, estéreo)", n: "Mide el tuyo si usas el master" },
    { id: "x6", t: "Cable de audio 3,5 mm blindado de 3 hilos", n: "" },
    { id: "x7", t: "Cable USB corto", n: "Para alimentar el adaptador", si: { usbad: [true] } },
    { id: "x8", t: "Cable 18–20 AWG (potencia y par trenzado de 24 VAC)", n: "", si: { ruta: ["indiv"] } },
    { id: "x9", t: "Cable 22 AWG (parlantes y +5 V al amplificador)", n: "", si: { ruta: ["indiv"] } },
    { id: "x10", t: "Cable 24–26 AWG (control y serial)", n: "" },
    { id: "x11", t: "Resistencias 1 kΩ y 2 kΩ (divisor del UART)", n: "Ya van soldadas en el master", si: { ruta: ["indiv"], uart: [true] } },
    { id: "x12", t: "Módulo DC-DC (buck) 5 V ≥ 3 A", n: "Opciones B o D", si: { alim: ["B", "D"] } },
    { id: "x13", t: "Cargador oficial de la Pi 5 y pulsador para el header J2", n: "Opción F", si: { alim: ["F"] } },
    { id: "x14", t: "Ventilador de 4 pines", n: "Elige 5 V o 12 V", si: { fan: ["5", "12"] } },
    { id: "x15", t: "Aislador de bucle de masa (opcional)", n: "Si hay zumbido" },
    { id: "x16", t: "Parlantes de reemplazo 1\" 4 Ω (opcional)", n: "Los originales miden 28 mm" }
  ] },
  { g: "Placa J20 (Rev 3)", items: [
    { id: "j1", t: "U1 · ATmega328P-PU (DIP-28) y zócalo", n: "El zócalo permite sacar el chip" },
    { id: "j2", t: "U2 · relé de estado sólido LCC110 (DIP-8) y zócalo", n: "" },
    { id: "j3", t: "Y1 · cristal 16 MHz HC49, C1 y C2 22 pF", n: "" },
    { id: "j4", t: "C3 · 470 µF electrolítico", n: "Respeta la polaridad" },
    { id: "j5", t: "D1 y D2 · 1N5819 Schottky", n: "Respeta la banda" },
    { id: "j6", t: "R1, R2 y R3 · 10 kΩ; R4 · 220 Ω", n: "" },
    { id: "j7", t: "J1 · bornera de 6; J2 · header 2×10 (cara inferior)", n: "TSW-110-23-G-D" },
    { id: "j8", t: "J3 y J5 · headers 2×3", n: "" },
    { id: "j9", t: "J4 · DB15 HD hembra en ángulo recto", n: "" }
  ] },
  { g: "Placa J22 (Rev 2)", items: [
    { id: "k1", t: "J1 · header 2×13 (cara inferior)", n: "929665-02-13-I" },
    { id: "k2", t: "J2 · bornera de 10", n: "" },
    { id: "k3", t: "J4 · header 2×3", n: "" },
    { id: "k4", t: "R1 y R2 · 220 Ω", n: "Limitan los LEDs" },
    { id: "k5", t: "J3 · jack 3,5 mm, R3 · 2,2 kΩ, C1 · 1 µF", n: "Solo con micrófono", si: { mic: [true] } },
    { id: "k6", t: "Micrófono electret AOM-5024L-HD-R", n: "Solo con micrófono", si: { mic: [true] } }
  ] },
  { g: "Placa Down Converter (Rev 1)", items: [
    { id: "d1", t: "J7 · Molex Micro-Fit 43045-2400, ángulo recto, 24 pines", n: "Header de PCB (no la carcasa 43020)" },
    { id: "d2", t: "J1 · bornera de 10; J2 · bornera de 4", n: "" },
    { id: "d3", t: "M1 · header de 4 pines para ventilador", n: "", si: { fan: ["5", "12"] } }
  ] },
  { g: "PCB master", si: { ruta: ["master"] }, items: [
    { id: "ms1", t: "PCB master v5 (≈252 × 267 mm, 2 capas)", n: "Gerber en hardware/master_pcb" },
    { id: "ms2", t: "Terminales: T_J22_J2 (10), T_J20_J1 (6), T_DC_J1 (10), T_DC_J2 (4), paso 5,00 mm", n: "Compruébalos contra las borneras reales" },
    { id: "ms3", t: "T_J20_J5 · header 2×3", n: "" },
    { id: "ms4", t: "R_DIV1 1 kΩ y R_DIV2 2 kΩ · SMD 0805", n: "Divisor del UART" },
    { id: "ms5", t: "J_PI_GPIO · header 1×8; J_AUDIO_IN · header 1×3", n: "" },
    { id: "ms6", t: "Módulo PAM8403 sobre U_AMP (19,05 × 22,86 mm, pines 2,54 mm)", n: "Mide el tuyo antes de pedir" },
    { id: "ms7", t: "2 tornillos M3 (H_BASE_A y H_BASE_B)", n: "" }
  ] }
];

/* ---------- Glosario ---------- */
MB.GLOSARIO = {
  "CRT": "Tubo de rayos catódicos: la pantalla original del iMac. Puede guardar miles de voltios aunque esté desenchufado.",
  "IVAD": "Placa de ajuste de video pegada al cuello del tubo. Controla colores, foco y geometría por I²C y hay que «engañarla» para que crea que sigue conectada a la placa lógica.",
  "PAV": "La placa down converter original del iMac. Convierte los 24 VAC de la placa analógica en los voltajes de la placa madre.",
  "Down converter": "Placa que recibe 24 VAC y entrega +3,3, +5 y +12 V (más los standby). En este proyecto se conecta a una placa breakout.",
  "DCO": "Señal «Down Converter On». La placa analógica la activa cuando la CRT enciende y habilita los rieles de potencia.",
  "PFW": "«Power Fail Warning»: pin del arnés J20 que se une al 5 V trickle para encender (junto con LPIACT).",
  "LPIACT": "«Logic Power Active»: pin del arnés J20 que se une al 5 V trickle para encender.",
  "PROT": "Pin de protección del arnés J20: con 5 V apaga todo el sistema. Se deja libre.",
  "Trickle": "5 V de reposo que entrega la placa analógica mientras el iMac está enchufado. Alimenta al ATmega aunque la CRT esté apagada.",
  "Standby": "Rieles que existen siempre que el iMac está enchufado (+8 V y +15 V en el down converter).",
  "I2C": "Bus de dos hilos (SDA datos, SCL reloj). El ATmega es el único maestro del bus del IVAD, en las direcciones 0x46 y 0x53.",
  "EDID": "Bloque de 128 bytes con el que un monitor le dice a la computadora qué resoluciones acepta.",
  "DDC": "Las dos líneas del cable VGA (pines 12 y 15) por las que viaja el EDID.",
  "VSYNC": "Sincronismo vertical del VGA. El ATmega lo cuenta para saber si sigue llegando imagen.",
  "ATmega": "Microcontrolador ATmega328P de la placa J20: inicializa el IVAD, lee el botón y controla el relé.",
  "ISP": "Programación en el circuito: grabar el ATmega sin sacarlo de la placa, por el header J3.",
  "UART": "Puerto serie. Aquí, 115200 baudios entre el ATmega y la Pi para calibrar la imagen.",
  "GPIO": "Pines de propósito general de la Pi (el header de 40 pines).",
  "KMS": "Controlador de video moderno de Raspberry Pi OS. Con KMS el modo de video se fija en cmdline.txt, no en config.txt.",
  "BTL": "Salida «en puente» del PAM8403: sus dos terminales de cada parlante llevan señal; ninguno es GND.",
  "PAM8403": "Amplificador clase D estéreo de 5 V (hasta 3 W por canal en 4 Ω).",
  "Bornera": "Bloque de terminales de tornillo para conectar cables sin soldar.",
  "Header": "Tira de pines macho (o hembra) soldada a la placa.",
  "Jumper de soldadura": "Dos o tres pastillas de cobre cercanas que se cierran con una gota de estaño para activar una función.",
  "Gerber": "Archivos que el fabricante de PCB usa para producir las placas. Van en un ZIP.",
  "iBOM": "Lista de materiales interactiva: muestra dónde va cada componente sobre la placa.",
  "DRC": "Comprobación de reglas de diseño de KiCad (distancias, bordes, taladros).",
  "Ferrita": "Cilindro en el cable que filtra ruido de alta frecuencia. Conserva la del cable VGA.",
  "Throttled": "Aviso de la Pi cuando limita su rendimiento por poca energía o temperatura. `vcgencmd get_throttled` debe dar 0x0.",
  "Buck": "Convertidor DC-DC reductor: baja un voltaje alto a otro menor.",
  "ESD": "Descarga electrostática. Puede destruir chips: usa pulsera y superficie antiestática.",
  "Flyback": "Transformador de alta tensión de la placa analógica. No lo toques con la CRT encendida.",
  "Bisel": "Marco interior de plástico (inner bezel). El original es muy quebradizo; hay uno imprimible en 3D."
};

/* ---------- Descargas ---------- */
/* Imágenes con versión en español (docs/traducciones/imagenes/); el resto usa el original. */
MB.TRAD = new Set(["chassis.jpg", "logic_board_and_downconverter_board.jpg", "analog_board.jpg", "analog_board_off.jpg", "analog_board_on.jpg",
  "J20_and_J22_in_view.jpg", "harness.jpg", "connectors_and_boards.png", "crt_power_on_and_off.png", "vga_adapter.png",
  "imac_g3_slot_loading_pav_board.png", "arduino_uno_wiring.png", "arduino_uno_wiring_to_transmit_edid.png", "arduino_nano_wiring.png",
  "arduino_nano_wiring_to_transmit_edid.png", "raspberry_pi_wiring.png", "arduino_uno_isp.png", "basic_wiring.png", "removing_down_converter_board.png"]);
MB.img = n => (MB.TRAD.has(n) ? "docs/traducciones/imagenes/" : "originales/imagenes/") + n;

MB.DESCARGAS = [
  { g: "Placas individuales (J20, J22, Down Converter)", d: "Gerber listo para fabricar, iBOM en español, esquemas y BOM de cada placa.", items: [
    { t: "J20 · Gerber", p: "hardware/placas_individuales/J20_video/fabricacion/imac_g3_333mhz_slot_loading_J20_adapter_board_es_gerber.zip", k: "gerber" },
    { t: "J22 · Gerber", p: "hardware/placas_individuales/J22_frontal_audio/fabricacion/imac_g3_slot_loading_J22_adapter_board_es_gerber.zip", k: "gerber" },
    { t: "Down Converter · Gerber", p: "hardware/placas_individuales/DownConverter/fabricacion/imac_g3_down_converter_board_adapter_es_gerber.zip", k: "gerber" },
    { t: "J20 · iBOM (abrir)", p: "hardware/placas_individuales/J20_video/ibom_es.html", k: "ver" },
    { t: "J22 · iBOM (abrir)", p: "hardware/placas_individuales/J22_frontal_audio/ibom_es.html", k: "ver" },
    { t: "Down Converter · iBOM (abrir)", p: "hardware/placas_individuales/DownConverter/ibom_es.html", k: "ver" },
    { t: "J20 · esquema PDF", p: "originales/esquemas_pdf/j20_schematic.pdf" },
    { t: "J22 · esquema PDF", p: "originales/esquemas_pdf/j22_schematic.pdf" },
    { t: "Down Converter · esquema PDF", p: "originales/esquemas_pdf/down_converter_breakout_board_schematic.pdf" },
    { t: "J20 · BOM (CSV, Digi-Key)", p: "hardware/placas_individuales/J20_video/esquematico_es/bill_of_materials.csv" },
    { t: "J22 · BOM (CSV, Digi-Key)", p: "hardware/placas_individuales/J22_frontal_audio/esquematico_es/bill_of_materials.csv" },
    { t: "Down Converter · BOM (CSV, Digi-Key)", p: "hardware/placas_individuales/DownConverter/esquematico_es/bill_of_materials.csv" }
  ], nota: "Los precios y existencias de los CSV de Digi-Key son de 2020: úsalos como lista de referencias, no de precios." },
  { g: "PCB master v5", d: "Diseño nuevo: DRC limpio (0 violaciones) pero sin fabricar ni verificar en hardware.", items: [
    { t: "Master · Gerber", p: "hardware/master_pcb/PCB_imac_unificado_master_v5_con_corte_gerber.zip", k: "gerber" },
    { t: "Master · iBOM (abrir)", p: "hardware/master_pcb/ibom_master.html", k: "ver" },
    { t: "Master · contorno 1:1 (DXF)", p: "hardware/master_pcb/PCB_imac_unificado_master_v5_contorno_1a1.dxf" },
    { t: "Master · contorno 1:1 (SVG)", p: "hardware/master_pcb/PCB_imac_unificado_master_v5_contorno_1a1.svg" },
    { t: "Master · KiCad (.kicad_pcb)", p: "hardware/master_pcb/PCB_imac_unificado_master_v5_con_corte.kicad_pcb" },
    { t: "Master · KiCad (.kicad_pro)", p: "hardware/master_pcb/PCB_imac_unificado_master_v5_con_corte.kicad_pro" },
    { t: "Master · informe DRC", p: "hardware/master_pcb/DRC_master_v5_con_corte.rpt" },
    { t: "Master · vista superior", p: "hardware/master_pcb/vistas_previas/PCB_imac_unificado_master_v5_gerber_vista_superior.png" },
    { t: "Master · vista inferior", p: "hardware/master_pcb/vistas_previas/PCB_imac_unificado_master_v5_gerber_vista_inferior.png" }
  ] },
  { g: "Bisel interior imprimible (STL)", d: "De Anthony Bernaert, licencia **CC BY-NC 4.0** (solo uso no comercial). Imprime los cuadrantes estándar **o** los «Supported», no ambos.", items: [
    { t: "Top_Left", p: "stl/bezel/Top_Left.stl" }, { t: "Top_Right", p: "stl/bezel/Top_Right.stl" }, { t: "Bottom_Left", p: "stl/bezel/Bottom_Left.stl" }, { t: "Bottom_Right", p: "stl/bezel/Bottom_Right.stl" },
    { t: "Top_Left_Supported", p: "stl/bezel/Top_Left_Supported.stl" }, { t: "Top_Right_Supported", p: "stl/bezel/Top_Right_Supported.stl" }, { t: "Bottom_Left_Supported", p: "stl/bezel/Bottom_Left_Supported.stl" }, { t: "Bottom_Right_Supported", p: "stl/bezel/Bottom_Right_Supported.stl" },
    { t: "Dowel_Top", p: "stl/bezel/Dowel_Top.stl" }, { t: "Dowel_Bottom", p: "stl/bezel/Dowel_Bottom.stl" }, { t: "Dowel_Left", p: "stl/bezel/Dowel_Left.stl" }, { t: "Dowel_Right", p: "stl/bezel/Dowel_Right.stl" },
    { t: "Power_Button", p: "stl/bezel/Power_Button.stl" },
    { t: "Screw_Cover_Top_Left", p: "stl/bezel/Screw_Cover_Top_Left.stl" }, { t: "Screw_Cover_Top_Right", p: "stl/bezel/Screw_Cover_Top_Right.stl" }, { t: "Screw_Cover_Bottom_Left", p: "stl/bezel/Screw_Cover_Bottom_Left.stl" }, { t: "Screw_Cover_Bottom_Right", p: "stl/bezel/Screw_Cover_Bottom_Right.stl" }
  ] },
  { g: "Soportes y modelos 3D de las placas", d: "Los soportes de `rpi_mount` son para Raspberry Pi 4.", items: [
    { t: "rpi_g3_spacer_v1 (Pi 4)", p: "stl/rpi_mount/rpi_g3_spacer_v1.stl" }, { t: "rpi_g3_plate_v2 (Pi 4)", p: "stl/rpi_mount/rpi_g3_plate_v2.stl" }, { t: "rpi_g3_bezel_v3 (Pi 4)", p: "stl/rpi_mount/rpi_g3_bezel_v3.stl" },
    { t: "Modelo 3D · placa J20", p: "stl/pcb/placa_J20_video.stl" }, { t: "Modelo 3D · placa J22", p: "stl/pcb/placa_J22_frontal_audio.stl" }, { t: "Modelo 3D · Down Converter", p: "stl/pcb/placa_DownConverter.stl" }, { t: "Modelo 3D · master", p: "stl/pcb/master_v5_con_corte.stl" }
  ] },
  { g: "Firmware y utilidades", d: "Código original de qbancoffee (LGPL-3.0).", items: [
    { t: "imacG3IvadInit.ino (ATmega)", p: "firmware/imacG3IvadInit/imacG3IvadInit.ino" },
    { t: "imacG3IvadInit.h", p: "firmware/imacG3IvadInit/imacG3IvadInit.h" },
    { t: "ivad.h", p: "firmware/imacG3IvadInit/ivad.h" },
    { t: "edidSimulator.ino", p: "firmware/edidSimulator/edidSimulator.ino" },
    { t: "init_ivad.py (solo sin placa J20)", p: "firmware/init_ivad.py" },
    { t: "edid.bin (EDID del iMac G3)", p: "firmware/edid.bin" },
    { t: "Utilidad Java de calibración (.jar)", p: "utilidades/ImacG3DVDisplayProperties/dist/ImacG3DVDisplayProperties.jar" },
    { t: "RXTXcomm.jar (necesario para la utilidad)", p: "utilidades/ImacG3DVDisplayProperties/dist/lib/RXTXcomm.jar" },
    { t: "Modelines (texto)", p: "docs/traducciones/imac_g3_modelines.txt" }
  ] },
  { g: "Guías en Markdown (GitHub)", d: "Se abren en GitHub con formato.", items: [
    { t: "Guía de cableado con Raspberry Pi 5", gh: "docs/guia_cableado_pi5.md" },
    { t: "Guía completa de implementación", gh: "docs/guia_macberry_pi.md" },
    { t: "Informe del PCB master v5", gh: "docs/informe_master_v5.md" },
    { t: "README del proyecto original (traducido)", gh: "docs/traducciones/README_proyecto_original_es.md" },
    { t: "Créditos y licencias", gh: "CREDITOS.md" }
  ] },
  { g: "Imágenes de la guía (traducidas al español)", d: "Versiones en español de los esquemas y fotos rotuladas del proyecto original. Los originales en inglés están en originales/imagenes/.", items: [
    { t: "Chasis con los conectores J20 y J22", p: "docs/traducciones/imagenes/chassis.jpg" },
    { t: "Placa lógica y down converter: rutas de alimentación", p: "docs/traducciones/imagenes/logic_board_and_downconverter_board.jpg" },
    { t: "Placa analógica, IVAD y entrada de red", p: "docs/traducciones/imagenes/analog_board.jpg" },
    { t: "Osciloscopio: apagado", p: "docs/traducciones/imagenes/analog_board_off.jpg" },
    { t: "Osciloscopio: encendido", p: "docs/traducciones/imagenes/analog_board_on.jpg" },
    { t: "J20 y J22 en el chasis", p: "docs/traducciones/imagenes/J20_and_J22_in_view.jpg" },
    { t: "Arnés de pruebas", p: "docs/traducciones/imagenes/harness.jpg" },
    { t: "Conectores del chasis e interruptor", p: "docs/traducciones/imagenes/connectors_and_boards.png" },
    { t: "Encender y apagar la CRT", p: "docs/traducciones/imagenes/crt_power_on_and_off.png" },
    { t: "Adaptador VGA", p: "docs/traducciones/imagenes/vga_adapter.png" },
    { t: "Alimentación de la placa PAV", p: "docs/traducciones/imagenes/imac_g3_slot_loading_pav_board.png" },
    { t: "Arduino Uno como monitor", p: "docs/traducciones/imagenes/arduino_uno_wiring.png" },
    { t: "Arduino Uno y EDID", p: "docs/traducciones/imagenes/arduino_uno_wiring_to_transmit_edid.png" },
    { t: "Arduino Nano como monitor", p: "docs/traducciones/imagenes/arduino_nano_wiring.png" },
    { t: "Arduino Nano y EDID", p: "docs/traducciones/imagenes/arduino_nano_wiring_to_transmit_edid.png" },
    { t: "Raspberry Pi como monitor", p: "docs/traducciones/imagenes/raspberry_pi_wiring.png" },
    { t: "Arduino Uno como programador ISP", p: "docs/traducciones/imagenes/arduino_uno_isp.png" },
    { t: "Cableado básico de las placas", p: "docs/traducciones/imagenes/basic_wiring.png" },
    { t: "Manual de Apple: retirar el down converter", p: "docs/traducciones/imagenes/removing_down_converter_board.png" }
  ] }
];

MB.VISORES = [
  { t: "Cableado sin master", p: "visores/cableado_sin_master.html", d: "Mapa interactivo de los cables punto a punto entre placas, amplificador y GPIO de la Pi.", iframe: true },
  { t: "Cableado con master", p: "visores/cableado_con_master.html", d: "Las 20 rutas de cobre y los cables cortos entre cada bornera y su terminal.", iframe: true },
  { t: "Todo en 3D", p: "visores/visor3d_pcbs.html", d: "El master con las 3 placas en sus bolsillos, la Pi 5 con su case, cables, rutas, logos y despiece." },
  { t: "Visor de STL", p: "visores/visor3d_stl.html", d: "Visor 3D de los modelos STL del repositorio." },
  { t: "Visor del bisel interior", p: "visores/visor_inner_bezel.html", d: "Las 17 piezas, ensamblaje, vista explosionada, orden de montaje, cotas y soportes. Pesa ~8,5 MB: tarda en cargar.", pesado: true }
];

MB.VIDEOS = [
  ["Inicialización de la placa IVAD con Arduino Uno", "https://youtu.be/JLaHMjQ7idI"],
  ["Modificando el iMac G3 DV usando únicamente una Raspberry Pi", "https://youtu.be/xSiqchucFE4"],
  ["Ensamblaje paso a paso de la placa J20", "https://youtu.be/qILuajxscnE"],
  ["Ensamblaje paso a paso de la placa J22", "https://youtu.be/JCPRYKbwKyk"],
  ["Funcionamiento de las tres placas instaladas", "https://youtu.be/dqxeiFkvuYg"],
  ["Híbrido MacBerry Pi ejecutando RetroPie", "https://youtu.be/CLCZFmmEnno"],
  ["Ajuste de parámetros de pantalla con la GUI en Java", "https://youtu.be/zrzcvThxDeY"],
  ["Jugando en el iMac G3 con NES", "https://youtu.be/wCEGIwrCOMQ"]
];

MB.GH = "https://github.com/JJaroll/MacBerry-Pi";
