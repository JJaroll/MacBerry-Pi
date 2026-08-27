
Estos son los archivos de proyecto de KiCad para este proyecto.

===Placas principales===

-imac_g3_333mhz_slot_loading_J20_adapter_board
	Esta placa es el "cerebro" de la operación, envía la secuencia de inicialización
	a la placa IVAD y también envía la información EDID a cualquier dispositivo que
	la solicite al conectarse al puerto VGA.
 
-imac_g3_down_converter_board_adapter
	Esta placa toma 24VAC de la placa analógica a través de la placa J22 y
	los convierte a voltajes estándar de fuente de alimentación de computadora: +12VDC, +5VDC
	y +3.3VDC. Esta placa también tiene una huella para incluir un conector
	para conectar un ventilador de CPU.
	
-imac_g3_slot_loading_J22_adapter_board
	Esta placa es esencialmente una placa adaptadora que permite utilizar los 
	altavoces integrados, el interruptor de encendido, los LEDs y los 24VAC.

-surfacemount_version	
	Esta será una versión de montaje superficial (SMD) de las placas principales originales.
	Actualmente está en desarrollo. La idea es tener placas
	que puedan ser ensambladas por un servicio de montaje para reducir los costes.
	
===Placas aportadas por usuarios===

-RPiG3iMac	
	Proyectos adicionales de KiCad para un HAT de Raspberry Pi y una placa adaptadora
	para la placa J20. Estas placas fueron aportadas por Rudy https://reng.ca
	, consulta el directorio para más detalles. 
