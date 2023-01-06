import Swal from "sweetalert2";

export function capturarError(param) {
	let obj = {};
	switch (param.status) {
		case 400:
			obj.code = param.status;
			obj.title = "¡Sesión caducada!";
			obj.message = param.data.message;
			break;
		case 401:
			obj.code = param.status;
			obj.title = "¡No Autorizado!";
			obj.message = param.data.message;
			break;
		case 403:
			obj.code = param.status;
			obj.title = "Acceso Prohibido";
			obj.message = param.data.message;
			break;
		case 404:
			obj.code = param.status;
			obj.title = "No Encontrado";
			obj.message = param.data.message;
			break;
		case 409:
			obj.code = param.status;
			obj.title = "Error con Token";
			obj.message = param.data.message;
			break;
		case 500:
			obj.code = param.status;
			obj.title = "Objeto Duplicado";
			obj.message = param.data.message;
			break;
		case 503:
			obj.code = param.status;
			obj.title = "Error en Servidor";
			obj.message = param.data.message;
			break;
		default:
			obj.code = 0;
			obj.title = "Error";
			obj.message = param.data.message;
			break;
	}

	// return obj;
	Swal.fire({
		icon: "error",
		title: obj.title,
		text: obj.message,
		showConfirmButton: false,
		allowOutsideClick: false,
		allowEscapeKey: false,
		timerProgressBar: true,
		timer: 2500,
		didOpen: (a) => {
			a.addEventListener("mouseenter", Swal.stopTimer);
			a.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});
}

export function alertaConexionPerdida(msg) {
	Swal.fire({
		icon: "warning",
		title: "¡Conexión Interrumpida!",
		text: msg,
		allowEscapeKey: false,
		allowOutsideClick: false,
		showConfirmButton: true,
	});
}

export function alertaCamposVacios(msg) {
	Swal.fire({
		icon: "warning",
		title: "¡Campo Obligatorio!",
		text: msg,
		allowEscapeKey: false,
		allowOutsideClick: false,
		showConfirmButton: true,
	});
}

export function alertaExitosa(msg) {
	Swal.fire({
		icon: "success",
		title: "Operación Exitosa!",
		text: msg,
		timer: 2500,
		timerProgressBar: true,
		allowOutsideClick: false,
		allowEscapeKey: false,
		showConfirmButton: false,
		didOpen: (a) => {
			a.addEventListener("mouseenter", Swal.stopTimer);
			a.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});
}

export function alertaAdvertencia(msg) {
	Swal.fire({
		icon: "warning",
		title: "Requiere Atención!",
		text: msg,
		allowEscapeKey: false,
		allowOutsideClick: false,
		showConfirmButton: true,
	});
}

export function limpiarTabla(tabla) {
	let numFilas = tabla.length;
	tabla.splice(tabla, numFilas);
	// console.log('Filas:',numFilas);
}

export function colorearSucursal(item) {
	if (item == "JAÉN") return "purple darken-2";
	else if (item == "TRUJILLO") return "yellow darken-2";
	else if (item == "CHACHAPOYAS") return "blue darken-2";
	else if (item == "TARAPOTO") return "green darken-2";
	else if (item == "CORPORATIVO") return "orange darken-2";
	else return "grey darken-2";
}

export function abreviaturaSucursal(item) {
	if (item == "JAÉN") return "JAE";
	else if (item == "TRUJILLO") return "TRU";
	else if (item == "CHACHAPOYAS") return "CHA";
	else if (item == "TARAPOTO") return "TAR";
	else if (item == "CORPORATIVO") return "COR";
}

export function colorOrigenData(item){
	if(item == 'CANAL AUTONORT') return '#D50000';
	else if(item == 'FACEBOOK E INSTAGRAM') return '#1565C0';
	else if(item == 'WEB TOYOTA') return '#78909C';
	else if(item == 'WHATSAPP') return '#4CAF50';
}

export function iconOrigenData(item){
	if(item == 'CANAL AUTONORT') return 'mdi-google-chrome';
	else if(item == 'FACEBOOK E INSTAGRAM') return 'mdi-facebook';
	else if(item == 'WEB TOYOTA') return 'mdi-car-side';
	else if(item == 'WHATSAPP') return 'mdi-whatsapp';
}

export function formatearFecha(fecha, completa) {
	let newDate = new Date(fecha);

	let year = newDate.getUTCFullYear();
	let month = newDate.getUTCMonth() + 1;
	let day = newDate.getUTCDate();

	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;

	let tiempo = newDate.toTimeString();

	if (completa) {
		return year + "-" + month + "-" + day + " " + tiempo.substring(0, 8);
	} else {
		return year + "-" + month + "-" + day;
	}
}

export function colorearEstadoLead(item) {
	if (item == "INGRESADO") return "grey lighten-1";
	else if (item == "NO INTERESADO") return "brown darken-4";
	else if (item == "ATENDIDO") return "lime lighten-1";
	else if (item == "ASIGNADO") return "orange darken-2";
	else if (item == "COTIZADO") return "indigo darken-4";
	else if (item == "DECLINADO") return "red accent-4";
	else if (item == "CONVERTIDO") return "green darken-2";
	else return "black";
}

export function colorearEstadoConversion(item) {
	if (item == "SEGUIMIENTO") return "blue darken-2";
	else if (item == "BOOKING") return "orange darken-2";
	else if (item == "DOWN") return "red accent-4";
	else if (item == "VENTA") return "green darken-2";
	else return "black";
}

export function colorearRedSocial(item) {
	if (item == "FACEBOOK E INSTAGRAM") return "blue darken-2";
	else if (item == "WHATSAPP") return "green darken-2";
	else if (item == "PIXEL") return "cyan accent-4";
	else if (item == "GOOGLE") return "orange accent-3";
	else if (item == "TWITTER") return "light-blue lighten-1";
	else return "grey darken-2";
}

export function validarVacios(item) {
	if (item == null || item == undefined || item == "") {
		return true;
	} else {
		return false;
	}
}

export function asignarVacio(item) {
	if (item == null || item == undefined || item == "") {
		return "";
	} else {
		return item;
	}
}

export function askHttp200(response){
	if(response === 200){
		return true;
	}else{
		return false;
	}
}

function decimalAdjust(type, value, exp) {
	// Si el exp no está definido o es cero...
	if (typeof exp === "undefined" || +exp === 0) {
		return Math[type](value);
	}
	value = +value;
	exp = +exp;
	// Si el valor no es un número o el exp no es un entero...
	if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
		return NaN;
	}
	// Shift
	value = value.toString().split("e");
	value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
	// Shift back
	value = value.toString().split("e");
	return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
}

export function round10(value, exp) {
	// console.log('Valor',value);
	return decimalAdjust("round", value, exp);
}

export function iconMotivoRechazo(item){
	if(item === 'Curiosidad') return 'mdi-head-dots-horizontal';
	else if(item === 'Falta de Stock') return 'mdi-stocking';
	else if(item === 'No califica por MAF') return 'mdi-bank-off';
	else if(item === 'No tiene presupuesto') return 'mdi-currency-usd-off';
	else if(item === 'Otros') return 'mdi-tag';
}