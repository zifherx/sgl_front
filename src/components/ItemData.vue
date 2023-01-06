<template>
	<div class="mx-5 my-5">
		<v-row>
			<v-col cols="12" sm="6" md="6" lg="4">
				<base-material-stats-card v-model="totalItem" color="primary" icon="mdi-tag" value="0" title="TOTAL"></base-material-stats-card>
			</v-col>
			<v-col cols="12" sm="6" md="6" lg="4">
				<base-material-stats-card v-model="totalActive" color="primary" icon="mdi-swap-horizontal" value="0" title="ACTIVE"></base-material-stats-card>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" sm="12" md="12" lg="12">
				<v-data-table
					:headers="headerTable"
					:items="contentTable"
					:search="search"
					:sort-by="ordenarBy"
					class="elevation-5"
					:loading="contentTable.length > 0 ? false : true"
					loading-text="Cargando Datos"
					hide-default-footer
					:items-per-page="itemsPerPage"
					:page.sync="page"
					@pagination="contadorItems"
					@page-count="pageCount = $event"
				>
					<template v-slot:top>
						<v-toolbar height="150" flat>
							<v-row>
								<v-col :cols="$vuetify.breakpoint.xs ? '1' : '1'" class="text-center">
									<v-avatar color="primary" class="white--text" size="36" v-text="contador"></v-avatar>
								</v-col>
								<v-col :cols="$vuetify.breakpoint.xs ? '9' : '4'">
									<v-toolbar-title class="text-uppercase display-1 mx-3 primary--text">
										{{ titleSubmodule }}
									</v-toolbar-title>
								</v-col>
								<v-spacer v-if="$vuetify.breakpoint.xs ? false : true"></v-spacer>
								<v-col :cols="$vuetify.breakpoint.xs ? '9' : '6'">
									<v-text-field v-model="search" label="Buscar ..." hide-details dense outlined rounded clearable prepend-inner-icon="mdi-magnify"></v-text-field>
								</v-col>
								<v-col :cols="$vuetify.breakpoint.xs ? '1' : '1'">
									<v-dialog v-model="dialogItem" persistent max-width="600" transition="dialog-bottom-transition">
										<template v-slot:activator="{ attrs, on }">
											<v-btn fab small class="mx-auto" color="primary" dark v-bind="attrs" v-on="on">
												<v-icon>mdi-plus</v-icon>
											</v-btn>
										</template>
										<v-card elevation="5">
											<v-card-title :class="$vuetify.breakpoint.xs ? 'text-uppercase text-h5 fondoTitulo' : 'text-uppercase display-1 fondoTitulo'">
												{{ titleDialog }}
											</v-card-title>
											<v-card-text>
												<v-container>
													<v-row>
														<v-col cols="12" sm="12" md="12" lg="8">
															<v-text-field v-model="editedItem.name" label="Nombre" prepend-icon="mdi-tag" hide-details color="primary"></v-text-field>
														</v-col>
														<v-col cols="12" sm="12" md="12" lg="4">
															<v-switch v-model="editedItem.status" hide-details inset color="primary" prepend-icon="mdi-check" :label="editedItem.status ? 'Activo' : 'Inactivo'"></v-switch>
														</v-col>
														<v-col v-if="titleSubmodule == 'Conversión' || titleSubmodule == 'estado'" cols="12" sm="12" md="12" lg="12">
															<v-slider
																v-model="editedItem.value"
																prepend-icon="mdi-scale"
																thumb-color="primary"
																ticks
																tick-size="5"
																thumb-label
																track-color="secondary"
																step="5"
																class="mt-10"
																min="0"
																max="100"
															></v-slider>
														</v-col>
														<v-col v-if="titleSubmodule == 'banco' || titleSubmodule == 'modelo' || titleSubmodule == 'marca'" cols="12" sm="12" md="12" lg="12">
															<v-file-input v-model="avatar" show-size label="Avatar" prepend-icon="mdi-camera" counter accept=".png, .jpg, .jpeg" small-chips></v-file-input>
														</v-col>
														<v-col v-if="titleSubmodule == 'banco' || titleSubmodule == 'modelo' || titleSubmodule == 'marca'" cols="12" sm="12" md="12" lg="12">
															<v-card class="mx-auto" elevation="1" max-width="300">
																<v-card-title class="text-uppercase fondoTitulo">Preview</v-card-title>
																<v-card-text>
																	<v-container>
																		<v-img :src="urlPreview" contain max-width="250"></v-img>
																	</v-container>
																</v-card-text>
															</v-card>
														</v-col>
													</v-row>
												</v-container>
											</v-card-text>
											<v-card-actions>
												<v-spacer></v-spacer>
												<v-btn text color="primary" @click="closeDialogItem">Cancelar</v-btn>
												<v-btn color="secondary" dark @click="guardarItem">Guardar</v-btn>
											</v-card-actions>
										</v-card>
									</v-dialog>
								</v-col>
							</v-row>
						</v-toolbar>
					</template>
					<template v-if="titleSubmodule == 'banco' || titleSubmodule == 'modelo' || titleSubmodule == 'marca'" v-slot:item.name="{ item }">
						<v-avatar size="80">
							<v-img :src="item.avatar" contain></v-img>
						</v-avatar>
						<span class="ml-5">{{ item.name }}</span>
					</template>
					<template v-slot:item.status="{ item }">
						<v-chip small dark :color="procesarEstado(item.status)" v-text="item.status ? 'ACTIVO' : 'INACTIVO'"></v-chip>
					</template>
					<template v-slot:item.actions="{ item }">
						<v-btn fab x-small color="accent" dark @click="verItem(item)">
							<v-icon>mdi-eye</v-icon>
						</v-btn>
						<v-btn fab x-small class="mx-1" color="primary" dark @click="eliminarItem(item)">
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</template>
				</v-data-table>
				<div class="text-center pt-2">
					<v-pagination v-model="page" :length="pageCount" :total-visible="8" circle></v-pagination>
				</div>
			</v-col>
		</v-row>
	</div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import Swal from "sweetalert2";
import * as pro from "../plugins/helper";

export default {
	props: {
		totalItem: Number,
		totalActive: Number,
		headerTable: Array,
		contentTable: Array,
		titleSubmodule: String,
		rutaAxiosModule: String,
		cargarData: Function,
		ordenarBy: String,
	},

	data() {
		return {
			search: "",
			contador: 0,
			page: 1,
			pageCount: 0,
			itemsPerPage: 20,
			dialogItem: false,
			editedIndex: -1,
			editedItem: {
				name: "",
				value: 0,
				status: true,
				createdBy: "",
			},
			defaultItem: {
				name: "",
				value: 0,
				status: true,
				createdBy: "",
			},
			avatar: null,
		};
	},

	computed: {
		...mapState(["user"]),

		userConectado() {
			if (this.user == null || this.user == undefined || this.user == "") {
				let usuario = {
					token: localStorage.getItem("data-token"),
					userCod: localStorage.getItem("data-user"),
				};
				return usuario;
			} else {
				return this.user;
			}
		},

		titleDialog() {
			return this.editedIndex === -1 ? `Nuevo ${this.titleSubmodule}` : `Actualizar ${this.titleSubmodule}`;
		},

		urlPreview() {
			if (!this.avatar) return;
			return URL.createObjectURL(this.avatar);
		},
	},

	watch: {
		dialogItem(val) {
			val || this.closeDialogItem();
		},
	},

	created() {
		this.detectarUsuario(this.userConectado);
		this.inicializar();
	},

	methods: {
		...mapActions(["detectarUsuario"]),
		contadorItems(pagination) {
			this.contador = pagination.itemsLength;
		},

		inicializar() {
			if (this.contentTable.length > 0) {
				pro.limpiarTabla(this.contentTable);
				this.cargarData();
			} else {
				this.cargarData();
			}
		},

		closeDialogItem() {
			this.dialogItem = false;
			this.$nextTick(() => {
				this.editedIndex = -1;
				this.editedItem = Object.assign({}, this.defaultItem);
				this.avatar = null;
			});
		},

		verItem(item) {
			this.editedIndex = this.contentTable.indexOf(item);
			this.editedItem = Object.assign({}, item);
			// this.avatar = this.editedItem.avatar;
			this.dialogItem = !this.dialogItem;
		},

		eliminarItem(item) {
			let id = item.codigo;
			this.editedIndex = this.contentTable.indexOf(item);
			Swal.fire({
				icon: "question",
				title: "¿Estás seguro que desea eliminarlo?",
				text: "No podrás revertir la acción",
				showCancelButton: true,
				confirmButtonText: "Si, eliminar",
				confirmButtonColor: "#43A047",
				cancelButtonText: "Cancelar",
				cancelButtonColor: "#d33",
				allowOutsideClick: false,
				allowEscapeKey: false,
			}).then(async (result) => {
				if (result.isConfirmed) {
					try {
						const query = await axios.delete(this.rutaAxiosModule + "/" + id);
						if (query.status == 200) {
							pro.alertaExitosa(query.data.message);
							this.inicializar();
						}
					} catch (err) {
						pro.capturarError(err.response);
					}
				}
			});
		},

		async guardarItem() {
			if (this.editedIndex > -1) {
				// console.log("Editar Item");
				let id = this.editedItem.codigo;
				let query = null;

				const formData = new FormData();
				formData.append("name", this.editedItem.name);
				formData.append("status", this.editedItem.status);
				formData.append("avatar", this.avatar);

				try {
					if (this.titleSubmodule == "banco" || this.titleSubmodule == "modelos" || this.titleSubmodule == "marca") {
						query = await axios.patch(this.rutaAxiosModule + "/" + id, formData);
					} else {
						query = await axios.patch(this.rutaAxiosModule + "/" + id, this.editedItem);
					}

					if (query.status == 200) {
						pro.alertaExitosa(query.data.message);
						this.inicializar();
						this.closeDialogItem();
					}
				} catch (err) {
					pro.capturarError(err.response);
				}
			} else {
				// console.log("Nuevo Item");
				const employee = await axios.get("users/" + this.$store.state.user.userCod);

				let query = null;

				const formData = new FormData();

				formData.append("name", this.editedItem.name);
				formData.append("status", this.editedItem.status);
				formData.append("createdBy", employee.data.founded.username);
				formData.append("avatar", this.avatar);

				let newObj = {
					name: this.editedItem.name,
					value: this.editedItem.value,
					status: this.editedItem.status,
					createdBy: employee.data.founded.username,
				};

				try {
					if (this.editedItem.name == "" || this.editedItem.name == null || this.editedItem.name == undefined) {
						pro.alertaCamposVacios("Nombre");
					} else {
						if (this.titleSubmodule == "banco" || this.titleSubmodule == "modelo" || this.titleSubmodule == "marca") {
							query = await axios.post(this.rutaAxiosModule, formData);
						} else {
							query = await axios.post(this.rutaAxiosModule, newObj);
						}
						if (query.status == 200) {
							pro.alertaExitosa(query.data.message);
							this.inicializar();
							this.closeDialogItem();
						}
					}
				} catch (err) {
					pro.capturarError(err.response);
				}
			}
		},

		validarCamposVacios(obj) {
			let msg = [];

			if (obj.name == "" || obj.name == null || obj.name == undefined) {
				msg.push("Nombre");
			}

			if (msg.length > 0) {
				pro.alertaCamposVacios(msg);
				return false;
			} else {
				return true;
			}
		},

		procesarEstado(status) {
			if (status) return "green darken-2";
			else return "red accent-4";
		},
	},
};
</script>
<style scoped>
.fondoTitulo {
	background-color: #d50000;
	color: white;
}
</style>
