import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";
import Swal from "sweetalert2";
import router from "../router";
import * as pro from "../plugins/helper";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		barColor: "rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)",
		drawer: null,
		user: null,
		error: null,
	},

	mutations: {
		SET_BAR_IMAGE(state, payload) {
			state.barImage = payload;
		},

		SET_DRAWER(state, payload) {
			state.drawer = payload;
		},

		setUsuario(state, payload) {
			state.user = payload;
		},

		setError(state, payload) {
			state.error = payload;
		},
	},

	actions: {
		async iniciarSesion({ commit }, user) {
			try {
				const query = await axios.post("/auth/signin", user);

				let userLogueado = {
					token: query.data.token,
					idUser: query.data.userCod,
				};

				commit("setUsuario", userLogueado);

				console.log("Usuario conectado ♥");
				localStorage.setItem("data-token", userLogueado.token);
				localStorage.setItem("data-user", userLogueado.idUser);

				const Toast = Swal.mixin({
					toast: true,
					position: "top-end",
					showConfirmButton: false,
					timerProgressBar: true,
					timer: 2500,
					didOpen: (a) => {
						a.addEventListener("mouseenter", Swal.stopTimer);
						a.addEventListener("mouseleave", Swal.resumeTimer);
					},
				});

				Toast.fire({
					icon: "success",
					title: "Login exitoso!",
				}).then(() => {
					router.push({ name: "Dashboard" });
				});
			} catch (err) {
				let errSession = {
					status: err.response.status,
					title: err.response.statusText,
					data: err.response.data,
				};

				if (err) commit("setError", errSession);

				pro.capturarError(errSession);
			}
		},

		async detectarUsuario({ commit }, usuario) {
			if (usuario == null) {
				commit("setUsuario", null);
			} else {
				let user = {
					token: localStorage.getItem("data-token"),
					userCod: localStorage.getItem("data-user"),
				};
				commit("setUsuario", user);
			}
		},

		async cerrarSesion({ commit }) {
			try {
				const query = await axios.post("auth/logout", null);
				if (query.status == 200) {
					commit("setUsuario", null);
					console.log("Usuario desconectado ♠");

					localStorage.removeItem("data-token");
					localStorage.removeItem("data-user");
					router.push("/");
				}
			} catch (err) {
				if (err.message == "Network Error") {
					pro.alertaConexionPerdida("Se perdió la conexión a Internet");
				} else {
					localStorage.removeItem("data-token");
					localStorage.removeItem("data-user");
					router.push("/");
				}
			}
		},
	},

	modules: {},
});
