# Guía de cableado y puesta en marcha · MacBerry Pi G3 (Raspberry Pi 5)

> Complementa la [guía completa de implementación](guia_macberry_pi.md): aquí están los **pines verificados contra los archivos KiCad**, el cableado paso a paso, los jumpers, la Pi 5 y las pruebas. Si hay diferencias de patillaje entre ambas guías, **manda esta**.

> Guía en español del montaje de una **Raspberry Pi 5** dentro de un **iMac G3 DV (slot loading)** usando las tres placas adaptadoras del proyecto original de [qbancoffee](https://github.com/qbancoffee/imac_g3_ivad_board_init) (J20, J22 y breakout del Down Converter). Versión interactiva: [`visores/cableado_sin_master.html`](../visores/cableado_sin_master.html). Con el PCB master: [`visores/cableado_con_master.html`](../visores/cableado_con_master.html).

> ⚠️ **Riesgo.** El CRT retiene carga aunque el iMac esté desenchufado. Trabaja con una sola mano cerca de la placa analógica, descarga el ánodo antes de meter las manos y usa pulsera antiestática.

> ⚠️ **Pines.** Los números de pin de esta guía vienen de las netlists KiCad y de los diagramas del repositorio original. No los mezcles con tablas de otras guías: en el cable J20 el RGB va en 17/15/13 y la sincronía en 9/11; en el J22 los 24 VAC están en 23–26 y el botón en 17. La placa analógica entrega **24 VAC** y «PAV» es el down converter.

## Índice
1. [Resumen de conexiones](#1-resumen-de-conexiones)
2. [Qué ocurre al encender](#2-qué-ocurre-al-encender)
3. [Pines por conector](#3-pines-por-conector)
4. [Jumpers de soldadura](#4-jumpers-de-soldadura)
5. [Raspberry Pi 5](#5-raspberry-pi-5)
6. [Otras formas de alimentar la Pi 5](#6-otras-formas-de-alimentar-la-pi-5)
7. [Pruebas antes de cerrar el chasis](#7-pruebas-antes-de-cerrar-el-chasis)

## 1. Resumen de conexiones

### Placas y módulos

| Elemento | Tipo | Qué hace |
|---|---|---|
| Cable J20 (desde la placa analógica) | Original del iMac | Arnés de 20 pines que antes iba a la placa lógica. Lleva el I2C del IVAD, el video analógico, el 5 V trickle y las señales de encendido. Se enchufa directo a la placa J20. |
| Cable J22 (panel frontal y audio) | Original del iMac | Arnés de 26 pines con botón, LEDs, parlantes, jacks de audífonos, micrófono y los 24 VAC de la placa analógica. Se enchufa directo a la placa J22. |
| Down converter (placa PAV original, J7) | Original del iMac | Fuente original del iMac. Convierte 24 VAC en voltajes de placa madre. Los rieles standby existen siempre; +3.3, +5 y +12 V solo se activan con DCO. |
| Placa J20 (Rev 3, ATmega328P y relé LCC110) | Placa adaptadora | El cerebro: el ATmega inicializa el IVAD por I2C (0x46 y 0x53), responde EDID en 0x50, lee el botón y enciende la CRT con el relé LCC110. Vive del 5 V trickle, así que funciona con la CRT apagada. El header J2 va soldado por la cara inferior. |
| Placa J22 (Rev 2, bornera J2 y jack de mic) | Placa adaptadora | Placa pasiva: solo expone botón, LEDs (con sus 220 Ω), parlantes, audífonos, micrófono y 24 VAC. No tiene amplificador, así que los parlantes necesitan uno externo. El header J1 y los jumpers del micrófono van por la cara inferior. |
| Placa down converter (Rev 1, borneras J1 y J2) | Placa adaptadora | Breakout pasivo del conector J7 del PAV. Recibe 24 VAC y DCO, y entrega los rieles en borneras. Trae header de ventilador con JP1 para elegir 5 V o 12 V. |
| Adaptador HDMI→VGA (con salida de audio 3.5 mm) | Módulo externo | Convierte la salida HDMI de la Pi a VGA para la J20. Elige uno con jack de audio: te ahorra el extractor HDMI aparte, porque la Pi 5 no tiene salida analógica. |
| Amplificador (PAM8403, 5 V estéreo) | Módulo externo | Clase D estéreo de 5 V, hasta 3 W por canal en 4 Ω: calza con los parlantes originales de 28 mm. Sus salidas son BTL, así que ningún terminal de parlante va a GND. |
| Raspberry Pi 5 (4 GB) | Computador | Recibe +5 V del down converter por GPIO, saca video y audio por micro-HDMI 0 y, opcionalmente, conversa con el ATmega por UART para ajustar geometría y brillo. |

### Cables

#### Cable J20 ↔ placa J20

- **Categoría:** Enchufe directo
- **Desde:** Arnés J20 del chasis
- **Hacia:** Placa J20, header J2 (2×10)
- **Cable:** Enchufe directo, sin cables

| Origen | Destino | Referencia |
|---|---|---|
| 1 / 2 | SDA / SCL IVAD | ATmega D4 / D5 |
| 5 | DCO | J1-5 |
| 6 | 5 V trickle | ATmega, relé |
| 7 / 8 | PROT / −10 V | J1-4 / J1-3 |
| 9 / 11 | H / V-SYNC | J4-13 / J4-14 |
| 10, 12 | PFW, LPIACT | relé, J1-6 |
| 13 / 15 / 17 | Azul / verde / rojo | J4-3 / 2 / 1 |

- Header macho 2×10 (TSW-110-23-G-D) soldado por la cara inferior de la placa. Revisa la orientación del pin 1 antes de presionar.
- Tabla completa en la vista Pines.

#### Cable J22 ↔ placa J22

- **Categoría:** Enchufe directo
- **Desde:** Arnés J22 del chasis
- **Hacia:** Placa J22, header J1 (2×13)
- **Cable:** Enchufe directo, sin cables

| Origen | Destino | Referencia |
|---|---|---|
| 13–16 | Parlantes | J2-7…10 |
| 17 | Botón | J2-4 |
| 18 | Común | GND |
| 19 / 20 | LED verde / ámbar | R1 / R2 220 Ω → J2-3 / J2-5 |
| 23–26 | 24 VAC | J2-1 / J2-2 |
| 5–10 | Audífonos | J4 |

- Header macho 2×13 (929665-02-13-I) soldado por la cara inferior de la placa.
- Los tornillos de montaje son GND común con el chasis: apriétalos bien.

#### PAV J7 ↔ placa down converter

- **Categoría:** Enchufe directo
- **Desde:** Conector J7 de la placa PAV
- **Hacia:** Placa down converter, J7
- **Cable:** Enchufe directo, sin cables

| Origen | Destino | Referencia |
|---|---|---|
| 8–11 | 24 VAC | J2-3 / J2-4 |
| 5 | DCO | J2-1 |
| 14, 15, 24 | +5 V | J1-5/6 |
| 13 | +12 V | J1-3/4 |
| 1, 18–21 | +3.3 V | J1-7/8 |
| 22 / 12 | +8 V / +15 V standby | J1-9 / J1-10 |

- Numeración Molex, no la de LG/Apple (ver Pines).
- Header Molex Micro-Fit 3.0 43045-2400 en ángulo recto, según la BOM del repo (DigiKey WM4728-ND). Es el header de PCB, no la carcasa 43020.

#### 24 VAC al down converter

- **Categoría:** 24 VAC
- **Desde:** Placa J22, J2-1 y J2-2
- **Hacia:** Placa down converter, J2-4 y J2-3
- **Cable:** Par trenzado 18–20 AWG

| Origen | Destino | Referencia |
|---|---|---|
| J22 J2-1 +AC | DC J2-4 +AC | chasis J22-24/26 |
| J22 J2-2 −AC | DC J2-3 −AC | chasis J22-23/25 |

- Es alterna: mídela con el multímetro en VAC.
- Está presente siempre que el iMac esté enchufado y alimenta los rieles standby del PAV.

#### DCO: encendido del down converter

- **Categoría:** Control
- **Desde:** Placa J20, J1-5
- **Hacia:** Placa down converter, J2-1
- **Cable:** 24–26 AWG

| Origen | Destino | Referencia |
|---|---|---|
| J20 J1-5 | DC J2-1 | chasis J20-5 → PAV J7-5 |

- La placa analógica activa DCO cuando la CRT enciende. La J20 solo lo lleva a su bornera.
- Sin este cable no aparecen +3.3, +5 ni +12 V, y la Pi no arranca.

#### Botón de encendido

- **Categoría:** Control
- **Desde:** Placa J22, J2-4
- **Hacia:** Placa J20, J1-1
- **Cable:** 24–26 AWG

| Origen | Destino | Referencia |
|---|---|---|
| J22 J2-4 | J20 J1-1 | chasis J22-17 → ATmega D3 |

- El botón cierra a GND (común en chasis J22-18). La J20 tiene pull-up de 10 kΩ al 5 V trickle.
- El firmware actúa al soltar: alterna CRT encendida y apagada.

#### LED verde de encendido

- **Categoría:** Control
- **Desde:** Placa J20, J1-6
- **Hacia:** Placa J22, J2-3
- **Cable:** 24–26 AWG

| Origen | Destino | Referencia |
|---|---|---|
| J20 J1-6 | J22 J2-3 | relé → R1 220 Ω → chasis J22-19 |

- Con la CRT encendida la línea queda en 5 V; apagada, en GND.
- La resistencia ya está en la J22: no agregues otra.

#### Video VGA

- **Categoría:** Video
- **Desde:** Adaptador HDMI→VGA
- **Hacia:** Placa J20, J4 (DB15 hembra)
- **Cable:** VGA macho-macho corto, con ferrita

| Origen | Destino | Referencia |
|---|---|---|
| DB15-1 / 2 / 3 | Rojo / verde / azul | chasis J20-17 / 15 / 13 |
| DB15-13 | H-SYNC | chasis J20-9 |
| DB15-14 | V-SYNC | chasis J20-11 y D10 (JP3) |
| DB15-5…8, 10 | GND | GND de video |
| DB15-12 / 15 | DDC (EDID) | ATmega A4 / A5 vía JP1 / JP2 |
| DB15-9 | +5 V del equipo | ATmega vía D2 |

- Suelda JP3: el ATmega vigila VSYNC y apaga la CRT tras unos 3 minutos sin señal.
- JP1 y JP2 activan el EDID del iMac, pero casi ningún adaptador lo reenvía a la Pi. Por eso el modo se fuerza en cmdline.txt.

#### HDMI de la Pi al adaptador

- **Categoría:** Video
- **Desde:** Raspberry Pi 5, micro-HDMI 0
- **Hacia:** Adaptador, entrada HDMI
- **Cable:** micro-HDMI a HDMI corto o adaptador rígido

| Origen | Destino | Referencia |
|---|---|---|
| micro-HDMI 0 | HDMI in | video + audio digital |

- Modo 1024×768 a 75 Hz. La CRT solo acepta los modos de su EDID (1024×768@75, 800×600@95, 640×480@117), todos cerca de 60 kHz horizontal; 1024×768 a 60 Hz queda fuera.

#### Alimentación del adaptador (opcional) *(opcional)*

- **Categoría:** Energía DC
- **Desde:** Raspberry Pi 5, USB-A
- **Hacia:** Adaptador, entrada micro-USB o USB-C
- **Cable:** Cable USB corto

| Origen | Destino | Referencia |
|---|---|---|
| USB-A | USB 5 V | solo energía |

- Solo si tu adaptador tiene entrada de alimentación. Muchos la necesitan para que el audio salga estable.

#### Audio analógico al amplificador

- **Categoría:** Audio
- **Desde:** Adaptador, jack 3.5 mm
- **Hacia:** PAM8403, entradas L, R y GND
- **Cable:** Cable 3.5 mm blindado de 3 hilos

| Origen | Destino |
|---|---|
| Punta | L in |
| Anillo | R in |
| Manga | GND |

- Si el adaptador no tiene jack, intercala un extractor de audio HDMI entre la Pi y el adaptador.
- Si escuchas zumbido, une el GND de entrada al GND del amplificador en un solo punto.

#### Parlantes

- **Categoría:** Audio
- **Desde:** PAM8403, salidas
- **Hacia:** Placa J22, J2-7 a J2-10
- **Cable:** 22 AWG, 4 hilos, respeta polaridad

| Origen | Destino | Referencia |
|---|---|---|
| L− | J22 J2-7 | chasis J22-16 |
| L+ | J22 J2-8 | chasis J22-14 |
| R− | J22 J2-9 | chasis J22-15 |
| R+ | J22 J2-10 | chasis J22-13 |

- El PAM8403 es BTL: las salidas − no son GND. No las unas entre sí ni a tierra.
- La J22 no amplifica; solo lleva estos cables a los parlantes originales de 28 mm y 4 Ω.

#### +5 V al amplificador

- **Categoría:** Energía DC
- **Desde:** Placa down converter, J1-6 y J1-2
- **Hacia:** PAM8403, VCC y GND
- **Cable:** 22 AWG

| Origen | Destino |
|---|---|
| DC J1-6 +5 V | VCC |
| DC J1-2 GND | GND |

- Usa la segunda borna de +5 V y GND para no empalmar con la línea de la Pi.

#### +5 V a la Raspberry Pi 5

- **Categoría:** Energía DC
- **Desde:** Placa down converter, J1-5 y J1-1
- **Hacia:** Raspberry Pi 5, pines 2, 4 y 6
- **Cable:** 18–20 AWG, lo más corto posible

| Origen | Destino | Referencia |
|---|---|---|
| DC J1-5 +5 V | Pi pin 2 y pin 4 | ideal un cable a cada pin |
| DC J1-1 GND | Pi pin 6 |  |

- Riel conmutado: la Pi enciende y se apaga junto con la CRT.
- Por GPIO no hay negociación USB-PD. Agrega usb_max_current_enable=1 solo si el riel entrega 5 A reales.
- Valida bajo carga: vcgencmd get_throttled debe devolver 0x0.

#### Ajuste de imagen por serial (opcional) *(opcional)*

- **Categoría:** Datos
- **Desde:** Placa J20, headers J5 y J3
- **Hacia:** Raspberry Pi 5, pines 8, 10 y 14
- **Cable:** 26 AWG, 3 hilos y dos resistencias

| Origen | Destino | Referencia |
|---|---|---|
| J20 J5-5 TX (5 V) | Pi pin 10 GPIO15 RXD | 1 kΩ en serie y 2 kΩ a GND |
| Pi pin 8 GPIO14 TXD | J20 J5-3 RX | directo |
| Pi pin 14 GND | J20 J3-6 GND | referencia del serial |

- Sin el divisor, los 5 V del ATmega pueden dañar la GPIO de la Pi.
- J5 no tiene GND: toma la referencia de J3-6, igual que el adaptador USB-serial de la foto del repo.
- 115200 baudios en /dev/ttyAMA0. Los comandos están en la vista Pi 5.

#### LED ámbar desde la Pi (opcional) *(opcional)*

- **Categoría:** Control
- **Desde:** Raspberry Pi 5, pin 16 (GPIO23)
- **Hacia:** Placa J22, J2-5
- **Cable:** 26 AWG

| Origen | Destino | Referencia |
|---|---|---|
| Pi pin 16 GPIO23 | J22 J2-5 | R2 220 Ω → chasis J22-20 |

- No está en el diseño original: es una propuesta para usar el LED ámbar como indicador de estado.
- La resistencia ya está en la J22; con 3.3 V circulan unos 5 mA.

## 2. Qué ocurre al encender

1. **Reposo.** Con el iMac enchufado, la placa analógica entrega 5 V trickle al ATmega y 24 VAC al down converter. Solo están activos los rieles standby.
2. **Presionas el botón.** La señal va de J22 J2-4 a J20 J1-1 y llega al pin D3 del ATmega. El firmware actúa cuando lo sueltas.
3. **Relé y LED verde.** D7 activa el LCC110, que une el 5 V trickle con PFW y LPIACT (chasis J20-10 y 12). La CRT enciende y el LED verde se prende por J20 J1-6 → J22 J2-3.
4. **DCO habilita energía.** La placa analógica activa DCO (chasis J20-5). Pasa por J20 J1-5 a la placa down converter y el PAV habilita +3.3, +5 y +12 V.
5. **Inicialización del IVAD.** 500 ms después, el ATmega envía la secuencia I2C por D4 y D5 (chasis J20-1 y 2) y carga desde la EEPROM la geometría y el brillo guardados.
6. **Arrancan la Pi y el amplificador.** El +5 V llega a los pines 2 y 4 de la Pi y al PAM8403. La Pi tarda unos segundos en sacar imagen; el ATmega le da hasta 3 minutos.
7. **Imagen.** HDMI → adaptador → VGA → J20 J4 → chasis J20 (RGB en 13, 15 y 17; sync en 9 y 11). El ATmega empieza a contar pulsos de VSYNC.
8. **Sonido.** Audio del adaptador → PAM8403 → J22 J2-7 a J2-10 → parlantes (chasis J22-13 a 16).
9. **Apagado.** Apaga la Pi con sudo poweroff. Sin VSYNC, el ATmega apaga la CRT y los rieles en unos 3 minutos. Si presionas el botón con la Pi encendida, le cortas la energía de golpe.

## 3. Pines por conector

### Cable J20

**Arnés J20 del chasis (20 pines)** — Se enchufa a la placa J20, header J2 (cara inferior).

| Pin | Señal | En la placa J20 |
|---|---|---|
| 1 | SDA IVAD | ATmega D4 (pin 6) |
| 2 | SCL IVAD | ATmega D5 (pin 11) |
| 3, 4 | GND | GND |
| 5 | DCO | J1-5 |
| 6 | 5 V trickle | ATmega (D1), relé, J3-2 |
| 7 | PROT | J1-4, 10 kΩ a GND |
| 8 | −10 V | J1-3 |
| 9 | H-SYNC | J4-13 |
| 10 | PFW | relé LCC110 |
| 11 | V-SYNC | J4-14, D10 vía JP3 |
| 12 | LPIACT: L1 LP | relé LCC110, J1-6 |
| 13 | Azul | J4-3 |
| 14 | GND azul | GND |
| 15 | Verde | J4-2 |
| 16 | GND verde | GND |
| 17 | Rojo | J4-1 |
| 18 | GND rojo | GND |
| 19 | Line sense | J1-2 |
| 20 | GND | GND |

**Encendido manual (sin placa J20)** — Referencia del README para pruebas.

| Acción | Pines |  |
|---|---|---|
| Encender | unir 6, 10 y 12 | luego enviar la init |
| Apagar | desconectar 6 |  |

### Cable J22

**Arnés J22 del chasis (26 pines)** — Se enchufa a la placa J22, header J1 (cara inferior).

| Pin | Señal | En la placa J22 |
|---|---|---|
| 1, 2 | Mic − y blindaje | GND |
| 3 | Mic + | JP2 → jack J3 |
| 4, 11 | GND audífonos | GND |
| 5 | H2 derecho | J4-1 |
| 6 | H2 izquierdo | J4-2 |
| 7 | H2 sense | J4-3 |
| 8 | H1 sense | J4-4 |
| 9 | H1 derecho | J4-5 |
| 10 | H1 izquierdo | J4-6 |
| 12, 21, 22 | NC | — |
| 13 | + parlante derecho | J2-10 |
| 14 | + parlante izquierdo | J2-8 |
| 15 | − parlante derecho | J2-9 |
| 16 | − parlante izquierdo | J2-7 |
| 17 | Botón | J2-4 |
| 18 | Común botón y LEDs | GND |
| 19 | LED verde | R1 220 Ω → J2-3 |
| 20 | LED ámbar | R2 220 Ω → J2-5 |
| 23, 25 | AC − | J2-2 |
| 24, 26 | AC + | J2-1 |

### PAV J7

**Conector J7 del down converter (24 pines)** — Numeración Molex usada en el esquemático; entre paréntesis, la de LG/Apple.

| Molex (LG) | Señal | En la placa DC |
|---|---|---|
| 1 (1) | +3.3 V | J1-7/8 |
| 2 (3), 3 (5) | GND | J1-1/2 |
| 4 (7) | PT | J2-2 |
| 5 (9) | DCO | J2-1 |
| 6 (11), 7 (13) | GND | J1-1/2 |
| 8 (15), 9 (17) | AC − | J2-3 |
| 10 (19), 11 (21) | AC + | J2-4 |
| 12 (23) | +15 V standby, +24 V encendido | J1-10 |
| 13 (2) | +12 V | J1-3/4 |
| 14 (4), 15 (6) | +5 V | J1-5/6 |
| 16 (8), 17 (10) | GND | J1-1/2 |
| 18–21 (12–18) | +3.3 V | J1-7/8 |
| 22 (20) | +8 V standby, +12 V encendido | J1-9 |
| 23 (22) | GND | J1-1/2 |
| 24 (24) | +5 V | J1-5/6 |

### Placa J20

**J1, bornera de 6** — De izquierda a derecha en la serigrafía: LED, DCO, PROT, −10 V, SENSE, botón.

| Borne | Señal | Conecta con |
|---|---|---|
| 1 | Botón (D3, pull-up 10 kΩ) | J22 J2-4 |
| 2 | Line sense | libre |
| 3 | −10 V | libre |
| 4 | PROT (5 V apaga todo) | libre |
| 5 | DCO | DC J2-1 |
| 6 | LED de encendido | J22 J2-3 |

**J4, VGA DB15 hembra** — Entrada de video desde el adaptador.

| Pin | Señal | Destino |
|---|---|---|
| 1 / 2 / 3 | Rojo / verde / azul | chasis J20-17 / 15 / 13 |
| 4, 11 | NC | — |
| 5–8, 10 | GND | GND |
| 9 | +5 V del equipo | ATmega vía D2 |
| 12 | SDA DDC | ATmega A4 vía JP1 |
| 13 | H-SYNC | chasis J20-9 |
| 14 | V-SYNC | chasis J20-11, D10 vía JP3 |
| 15 | SCL DDC | ATmega A5 vía JP2 |

**J5, header 2×3** — Serial y pines libres del ATmega. Niveles de 5 V.

| Pin | Señal | Uso |
|---|---|---|
| 1 | SDA equipo (A4) | EDID |
| 2 | SCL equipo (A5) | EDID |
| 3 | RX serial (D0) | ← Pi pin 8 |
| 4 | PB0 (D8) | libre |
| 5 | TX serial (D1) | → divisor → Pi pin 10 |
| 6 | PB1 (D9) | libre |

**J3, programación ISP** — Arduino Uno con el sketch ArduinoISP, según el diagrama del repo. Ese diagrama no conecta 5 V: la placa se alimenta del 5 V trickle instalada en el iMac.

| J3 | Señal | Arduino Uno |
|---|---|---|
| 1 | MISO | D12 |
| 2 | 5 V trickle | no conectar |
| 3 | SCK | D13 |
| 4 | MOSI | D11 |
| 5 | RESET | D10 |
| 6 | GND | GND (y referencia del UART) |

**Relé LCC110 y jumpers** — Relé de estado sólido 1 Form C, confirmado en el esquemático Rev 3.

| Ref. | Función | Nota |
|---|---|---|
| U2-2 / 3 | LED del relé | D7 y R4 220 Ω a GND |
| U2-5 (NO) | 5 V trickle | se une al común con D7 en alto |
| U2-6 / 7 (común) | PFW, LPIACT, J1-6 | chasis J20-10 y 12 |
| U2-8 (NC) | GND | mantiene la CRT apagada en reposo |
| JP1 / JP2 | VGA 12 / 15 ↔ A4 / A5 | EDID |
| JP3 | V-SYNC ↔ D10 | suéldalo |
| J2 2×10 | header al arnés | cara inferior |

### Placa J22

**J2, bornera de 10** — Orden de la serigrafía, de izquierda a derecha.

| Borne | Señal | Conecta con |
|---|---|---|
| 1 | +AC | DC J2-4 |
| 2 | −AC | DC J2-3 |
| 3 | LED verde (220 Ω) | J20 J1-6 |
| 4 | Botón | J20 J1-1 |
| 5 | LED ámbar (220 Ω) | libre o Pi pin 16 |
| 6 | GND | libre |
| 7 | − izquierdo | amp. L− |
| 8 | + izquierdo | amp. L+ |
| 9 | − derecho | amp. R− |
| 10 | + derecho | amp. R+ |

**J4, audífonos frontales** — Salidas hacia los jacks del chasis.

| Pin | Señal |
|---|---|
| 1 | H2 derecho |
| 2 | H2 izquierdo |
| 3 | H2 sense |
| 4 | H1 sense |
| 5 | H1 derecho |
| 6 | H1 izquierdo |

**Micrófono, J3 y jumpers** — Según la nota del esquemático Rev 2. Solo si usarás el micrófono del chasis con una tarjeta de sonido USB. Los pads están en la cara inferior.

| Modo o ref. | Qué soldar o qué hace |
|---|---|
| Con circuito (electret) | JP1 y JP2 pads 1–2 |
| Directo al equipo | JP2 pads 2–3, JP1 abierto |
| JP3 | solo para probar 5 V: no lo sueldes |
| J3 punta | señal del micrófono |
| J3 anillo | polarización (R3 2.2 kΩ, C1 1 µF) |
| J3 manga | GND |
| J1 2×13 | header al arnés, cara inferior |

### Placa DC

**J1, bornera de 10** — Rieles de salida.

| Borne | Riel | Uso propuesto |
|---|---|---|
| 1 | GND | Pi pin 6 |
| 2 | GND | amplificador |
| 3, 4 | +12 V | libre |
| 5 | +5 V | Pi pines 2 y 4 |
| 6 | +5 V | amplificador |
| 7, 8 | +3.3 V | libre |
| 9 | +8 V standby, +12 V encendido | libre |
| 10 | +15 V standby, +24 V encendido | opción B de alimentación |

**J2, bornera de 4** — En la serigrafía: +AC, −AC, PT, DCO.

| Borne | Señal | Conecta con |
|---|---|---|
| 1 | DCO | J20 J1-5 |
| 2 | PT | libre |
| 3 | −AC | J22 J2-2 |
| 4 | +AC | J22 J2-1 |

**Ventilador** — Header de 4 pines con PWM y tacómetro en puntos de prueba.

| Ref. | Función |
|---|---|
| M1-1 | GND |
| M1-2 | V ventilador (JP1) |
| M1-3 / TP1 | tacómetro |
| M1-4 / TP2 | PWM |
| JP1 | puente a +5 V o a +12 V |

### Pi 5

**GPIO usados** — Propuesta para esta integración.

| Pin | Función | Conecta con |
|---|---|---|
| 2, 4 | +5 V | DC J1-5 |
| 6 | GND | DC J1-1 |
| 8 | GPIO14 TXD | J20 J5-3 (opcional) |
| 10 | GPIO15 RXD | divisor ← J20 J5-5 (opcional) |
| 14 | GND | J20 J3-6 (opcional) |
| 16 | GPIO23 | J22 J2-5 (opcional) |

**Puertos**

| Puerto | Uso |
|---|---|
| micro-HDMI 0 | video y audio al adaptador |
| USB-A | energía del adaptador (si la pide) |
| USB-C | libre: la Pi se alimenta por GPIO |

## 4. Jumpers de soldadura

Un jumper de soldadura son dos o tres pastillas de cobre muy juntas. Por defecto quedan abiertas; un puente de estaño las cierra. Todos van por la cara inferior de cada placa.

### Placa J20 — JP1 y JP2, EDID por DDC

*Recomendado soldar*

El VGA lleva dos líneas extra, SDA y SCL (pines 12 y 15 del DB15), llamadas DDC. Por ahí un monitor le informa al equipo su resolución nativa (EDID). Estos jumpers deciden si esas líneas del cable VGA quedan conectadas al ATmega para que responda ese EDID.

| Jumper | Une | Efecto al soldar |
|---|---|---|
| JP1 | DB15-12 (SDA) ↔ ATmega A4 | el ATmega puede recibir/responder por SDA |
| JP2 | DB15-15 (SCL) ↔ ATmega A5 | el ATmega puede recibir/responder por SCL |

**Recomendación:** suelda ambos. Sin ellos el equipo no recibe ningún EDID por el cable VGA y depende solo de lo que fuerces en `cmdline.txt`. La mayoría de los adaptadores HDMI→VGA de todas formas no reenvían ese EDID hacia la Pi, así que el efecto práctico es chico, pero soldarlos no tiene contras y mantiene la placa fiel al diseño original.

**Cómo soldar:** con el cautín, une las dos pastillas de cada jumper con una gota de estaño hasta que quede un puente continuo entre ambas.

### Placa J20 — JP3, apagado automático por VSYNC

*Soldar siempre*

Une la señal V-SYNC del VGA con el pin D10 del ATmega. Es lo que le permite al microcontrolador contar los pulsos de sincronismo vertical y notar cuándo el equipo dejó de mandar video.

| Jumper | Une | Efecto al soldar |
|---|---|---|
| JP3 | V-SYNC ↔ ATmega D10 | el firmware puede monitorear VSYNC |

**Este jumper sí es obligatorio.** Sin él, la CRT nunca se apaga sola: solo la puedes apagar con el botón. El firmware usa esta señal para apagar la CRT unos 3 minutos después de que la Pi deja de enviar imagen (por ejemplo, al hacer `sudo poweroff`).

**Cómo soldar:** igual que los anteriores, une las dos pastillas con estaño.

### Placa J22 — circuito del micrófono

*Solo si usarás el micrófono*

El micrófono del chasis es un electret: necesita un voltaje de polarización para funcionar, que normalmente entrega la propia entrada de micrófono del equipo. JP1 y JP2 configuran cómo llega esa polarización; JP3 es solo para pruebas.

| Modo | Qué soldar | Cuándo usarlo |
|---|---|---|
| Con circuito (recomendado) | JP1 completo, y en JP2 los pads 1–2 | interfaz USB o tarjeta de sonido con entrada de micrófono estándar |
| Directo al equipo | Solo JP2, pads 2–3 (deja JP1 abierto) | si tu interfaz ya polariza el micrófono por su cuenta |
| JP3 | no soldar | solo sirve para medir 5 V del circuito durante pruebas |

Si no vas a conectar el micrófono del chasis (por ejemplo, porque usarás uno USB aparte), puedes dejar J3, R3, C1 y los tres jumpers sin soldar y sin instalar.

**Cómo soldar:** JP1 y JP3 son de 2 pastillas, une ambas con estaño. JP2 tiene 3 pastillas en línea: la del medio es común, y sueldas puente hacia el lado 1–2 o hacia el lado 2–3 según el modo que elijas, nunca ambos lados a la vez.

### Placa down converter — JP1, voltaje del ventilador

*Elige uno de los dos lados*

El header de 4 pines para ventilador (M1) necesita un voltaje de alimentación. JP1 tiene 3 pastillas: la del medio va al pin de alimentación del ventilador, y decides si ese pin recibe +5 V o +12 V soldando hacia un lado u otro.

| Puente | Efecto |
|---|---|
| Pastillas 1–2 (hacia +5V) | el ventilador recibe 5 V |
| Pastillas 2–3 (hacia +12V) | el ventilador recibe 12 V |

Revisa el voltaje nominal de tu ventilador antes de elegir. La mayoría de los ventiladores de 40–60 mm para electrónica funcionan a 12 V pero muchos giran, más silenciosos, con 5 V. Nunca sueldes los dos lados a la vez: pondrías 5 V y 12 V en corto.

**Cómo soldar:** une con estaño la pastilla central con la del voltaje elegido. Si más adelante quieres cambiar de voltaje, retira el estaño con una malla desoldadora antes de puentear el otro lado.

## 5. Raspberry Pi 5

La placa J20 ya inicializa el IVAD; la Pi solo aporta video, audio y, si quieres, ajustes por serial.

### Conexiones de la Pi

| Pin o puerto | Señal | Destino |
|---|---|---|
| 2 y 4 | +5 V | DC J1-5 |
| 6 | GND | DC J1-1 |
| 8 GPIO14 | TXD | J20 J5-3 (opcional) |
| 10 GPIO15 | RXD | J20 J5-5 con divisor 1 kΩ / 2 kΩ (opcional) |
| 14 | GND | J20 J3-6, referencia UART (opcional) |
| 16 GPIO23 | LED ámbar | J22 J2-5 (opcional) |
| micro-HDMI 0 | video y audio | adaptador HDMI→VGA |
| USB-A | 5 V | adaptador, si lo requiere |

No conectes el I2C de la Pi al cable J20: con la placa J20 instalada, el ATmega es el único maestro del bus del IVAD.

### Alimentación: decide antes de cablear

- **A. Riel +5 V conmutado** — DC J1-5 directo a los pines 2 y 4. Sin módulos extra; la Pi enciende con la CRT. Apaga siempre con `sudo poweroff` y deja que la CRT se apague sola.

- **B. Reductor desde +15 V standby** — DC J1-10 → módulo DC-DC (XY-3606 o similar) → 5 V. La Pi puede quedar encendida con la CRT apagada. La capacidad del standby es desconocida y la línea sube a 24 V al encender: verifica el rango de entrada del módulo y mide antes.

En ambos casos valida con MIN/MAX HOLD y `vcgencmd get_throttled`.

### Configuración del sistema

```
# Al final de la única línea de /boot/firmware/cmdline.txt
video=HDMI-A-1:1024x768@75D
```

```
# /boot/firmware/config.txt
dtoverlay=vc4-kms-v3d
# solo si el riel +5 V entrega 5 A reales
usb_max_current_enable=1
# solo si usas el UART con la J20
dtparam=uart0=on
```

```
vcgencmd get_throttled       # esperado: throttled=0x0
screen /dev/ttyAMA0 115200   # luego presiona p
```

Si la imagen no sincroniza, prueba `1024x768M@75D` (timings CVT) o baja a `800x600@95D`. Mantén la frecuencia horizontal cerca de 60 kHz.

### Ajuste de imagen por serial

| Tecla | Ajuste |
|---|---|
| a / s | posición horizontal |
| w / z | posición vertical |
| d / f | ancho |
| r / c | alto |
| g / h | contraste − / + |
| j / k | brillo − / + |
| x / v | paralelogramo |
| b / n | keystone |
| t / y | rotación |
| u / i | pincushion |
| p | mostrar valores |
| o | apagar la CRT |

Solo responde con la CRT encendida. Si la Pi está en el riel conmutado, `o` también le corta la energía.

### Qué cambia respecto de la guía original (Pi 4)

- `vc4-fkms-v3d` ya no existe en Pi 5: usa `vc4-kms-v3d`.

- `hdmi_ignore_edid`, `hdmi_group` y `hdmi_mode` se ignoran con KMS: el modo va en `cmdline.txt`.

- `/boot/config.txt` pasó a `/boot/firmware/config.txt`.

- El DC-DC de 5 V y 3 A que recomienda la guía para la Pi 4 se queda corto: la Pi 5 pide 5 A para entregar corriente completa por USB.

- `init_ivad.py` y `rc.local` solo aplican sin placa J20. Con la J20, el ATmega hace la inicialización.

- El soporte `rpi_mount` es para Pi 4: el patrón de agujeros coincide, pero Ethernet y USB están intercambiados en la Pi 5. Revisa el recorte del bezel v3.

## 6. Otras formas de alimentar la Pi 5

La guía usa por defecto GPIO directo desde el riel conmutado (Opción A). Estas son las alternativas revisadas.

| Método | Riel de origen | ¿Necesita PSU_MAX_CURRENT? | ¿Pi se apaga con la CRT? | Complejidad |
|---|---|---|---|---|
| A — GPIO directo | +5V conmutado (down conv.) | Sí | Sí, de golpe | Baja |
| B — Buck desde +15V standby | +15V standby | Sí | No | Media |
| C — USB-C directo | +5V conmutado (down conv.) | Sí | Sí, de golpe | Baja |
| D — Buck a USB-C desde +12V | +12V (conmutado o standby) | Sí | Según el riel elegido | Media |
| E — Módulo fuente PD | Cualquier riel DC | Normalmente sí igual | Depende del riel | Alta, poco beneficio |
| F — Cargador oficial + botón | Red eléctrica (independiente) | No | No, apagado por software | Media |

### A — GPIO directo (la de esta guía)

*Ya documentada en Pi 5*

DC J1-5 (+5V) y J1-1 (GND) directo a los pines 2/4 y 6 de la Pi. Es el método que usa el resto de la guía.

Ver el detalle completo, con las dos variantes (riel conmutado o standby), en la pestaña **Pi 5**.

### B — Reductor DC-DC desde +15V standby

*Ya documentada en Pi 5*

Un módulo reductor (ej. XY-3606) baja el standby +15V a 5V estables. La Pi queda encendida aunque la CRT esté apagada.

Detalle completo en la pestaña **Pi 5**.

### C — USB-C directo desde el down converter

*Nuevo*

Mismo riel de +5V que la Opción A, pero entregado por el puerto USB-C en vez de GPIO. Solo cambia el conector.

La Pi 5 negocia energía por USB-C mediante USB PD real, no por resistencias simples. Sin un chip PD de por medio, asume 5V/3A y limita los puertos USB a 600 mA, mostrando el aviso de energía limitada.

```
# En el EEPROM del bootloader (rpi-eeprom-config --edit)
PSU_MAX_CURRENT=3000

# o en /boot/firmware/config.txt, para permitir 1.6A a los puertos USB
usb_max_current_enable=1
```

Usa solo VBUS y GND del conector USB-C; D+/D- y CC quedan sin conectar.

### D — Conversor DC-DC hacia USB-C desde +12V

*Nuevo*

Un buck genérico (sin PD) reduce el +12V del down converter a 5V y los entrega por USB-C. Parte de un riel con más margen que el +5V ya regulado.

Elige un módulo pensado para al menos 5V/3A, con buen rizado. Sigue sin haber negociación PD: aplica el mismo `PSU_MAX_CURRENT` que en la Opción C. Si el +12V es conmutado, la Pi se apaga con la CRT; si lo tomas del standby, queda siempre encendida.

### E — Módulo fuente PD (nicho)

*No recomendado salvo caso puntual*

Un chip fuente PD real (no confundir con los "trigger" que solo consumen PD) negocia con la Pi como lo haría un cargador. Son mucho menos comunes que los módulos sink/trigger.

Casi ningún módulo comercial implementa el perfil opcional 5V/5A que pide la Pi 5 — es casi exclusivo de las fuentes oficiales. En la práctica, aunque la negociación PD funcione, sueles quedar igual en 5V/3A con el mismo aviso de energía limitada que las opciones anteriores. Solo vale la pena si programas tú mismo el chip PD con ese perfil.

### F — Cargador oficial independiente + botón sincronizado

*La más robusta*

El cargador oficial va a la pared, sin depender del 24VAC del iMac. La Pi queda siempre alimentada; el botón del iMac dispara la CRT *y*, en paralelo, el apagado/encendido por software de la Pi.

| Evento | Qué pasa con la CRT | Qué pasa con la Pi |
|---|---|---|
| 1er toque, todo apagado | enciende (secuencia normal del ATmega) | J2 recibe el mismo toque → arranca |
| 2do toque, todo encendido | apaga la CRT de inmediato | J2 pide apagado de software (real, sin corte brusco) |
| Pi termina de apagarse | sin cambios | queda "apagada pero alimentada", lista para el próximo toque |

**Cablea un segundo hilo** desde el mismo contacto del botón (o desde J22 J2-4) hasta un lado del header J2 de la Pi 5; el otro lado de J2 va a GND. Es una conexión pasiva en paralelo: no interfiere con lo que ya lee el ATmega.

**Usa Raspberry Pi OS Lite** si quieres que un solo toque apague todo de forma simétrica. En Desktop, apagar pide un segundo toque de confirmación (o ajusta `HandlePowerKey` en logind.conf, aunque no siempre se respeta del todo).

El apagado automático de la CRT por falta de VSYNC sigue funcionando igual — de hecho aquí es más relevante, porque ya no hay corte de energía que "fuerce" el apagado.

## 7. Pruebas antes de cerrar el chasis

### Antes de energizar

- [ ] ATmega programado con imacG3IvadInit (SoftwareWire y EEPROMWearLevel; BUFFER_LENGTH y TWI_BUFFER_LENGTH en 128), en un Arduino Uno o por J3 con ArduinoISP.
- [ ] Headers J2 de la placa J20 y J1 de la placa J22 soldados por la cara inferior.
- [ ] JP3 soldado en la J20 para el apagado automático por VSYNC. En la J22, JP3 sin soldar.
- [ ] Tornillos de montaje de las tres placas con continuidad a GND del chasis.
- [ ] Sin corto entre +5 V y GND en la bornera J1 de la placa DC.
- [ ] Salidas del amplificador cableadas sin unir ningún − a GND.

### Primer encendido sin la Pi

- [ ] iMac enchufado: 5 V entre J3-2 y J3-6 de la placa J20 (5 V trickle).
- [ ] Unos 24 VAC entre J2-1 y J2-2 de la J22, con el multímetro en VAC.
- [ ] Botón: LED verde encendido y el sonido de la CRT al activarse.
- [ ] Placa DC: +3.3, +5 y +12 V presentes en J1 tras el encendido.
- [ ] Riel +5 V con carga resistiva: MIN/MAX HOLD sin bajar de 4.75 V.

### Con la Pi conectada

- [ ] vcgencmd get_throttled devuelve 0x0 con CPU y USB bajo carga.
- [ ] Imagen estable a 1024×768 y 75 Hz.
- [ ] Audio en ambos parlantes, sin zumbido.
- [ ] Si usas UART: la tecla p muestra los ajustes actuales.
- [ ] sudo poweroff: la CRT se apaga sola en unos 3 minutos.

---

Fuente: documentación y archivos del repositorio [qbancoffee/imac_g3_ivad_board_init](https://github.com/qbancoffee/imac_g3_ivad_board_init) (LGPL-3.0), commit `af7c43a`, revisando netlists, esquemáticos PDF, firmware, BOM y diagramas; adaptación a Raspberry Pi 5 y redacción en español por [JJaroll.dev](https://jjaroll.dev). Ver [CREDITOS.md](../CREDITOS.md).
