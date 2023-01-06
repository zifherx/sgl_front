<template>
	<div class="mx-5 my-5">
		<v-row>
			<v-col cols="12" sm="6" md="6" lg="4">
				<base-material-stats-card
					v-model="totalSellers"
					color="primary"
					icon="mdi-account-box"
					value="0"
					title="TOTAL"
				></base-material-stats-card>
			</v-col>
			<v-col cols="12" sm="6" md="6" lg="4">
				<base-material-stats-card
					v-model="totalSellersActive"
					color="primary"
					icon="mdi-account-circle"
					value="0"
					title="ACTIVOS"
				></base-material-stats-card>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" sm="12" md="12" lg="12">
				<v-data-table
					:headers="headerTable"
					:items="contentTable"
					:search="search"
					class="elevation-5"
					show-group-by
					group-by="sucursal"
					:loading="contentTable.length > 0 ? false : true"
					loading-text="Cargando datos"
					hide-default-footer
					:items-per-page="itemsPerPage"
					:page.sync="page"
					@pagination="contadorItems"
					@page-count="pageCount = $event"
				>
					<template v-slot:top>
						<v-toolbar flat height="150">
							<v-row>
								<v-col :cols="$vuetify.breakpoint.xs ? '1' : '1'">
									<v-avatar color="primary" class="white--text" size="32" v-text="contador"></v-avatar>
								</v-col>
								<v-col :cols="$vuetify.breakpoint.xs ? '9' : '4'">
									<v-toolbar-title class="mx-5 text-uppercase display-1 primary--text">VENDEDOR</v-toolbar-title>
								</v-col>
								<v-spacer v-if="$vuetify.breakpoint.xs ? false : true"></v-spacer>
								<v-col :cols="$vuetify.breakpoint.xs ? '9' : '5'">
									<v-text-field
										v-model="search"
										label="Buscar..."
										prepend-inner-icon="mdi-magnify"
										color="primary"
										hide-details
										clearable
										dense
										outlined
										rounded
									></v-text-field>
								</v-col>
								<v-col :cols="$vuetify.breakpoint.xs ? '1' : '1'">
									<v-dialog v-model="dialogSeller" persistent max-width="700" transition="dialog-bottom-transition">
										<template v-slot:activator="{ attrs, on }">
											<v-btn fab small dark class="ml-5" color="primary" v-bind="attrs" v-on="on">
												<v-icon>mdi-plus</v-icon>
											</v-btn>
										</template>
										<v-card elevation="5">
											<v-card-title class="text-uppercase text-h5 fondoTitulo" v-text="titleDialog"></v-card-title>
											<v-card-text>
												<v-container>
													<v-row class="mt-2">
														<v-col cols="12" sm="12" md="12" lg="8">
															<v-text-field
																v-model="editedItem.name"
																label="Colaborador"
																prepend-icon="mdi-account"
																hide-details
																dense
																color="primary"
																placeholder="Ingrese vendedor"
															></v-text-field>
														</v-col>
														<v-col cols="12" sm="12" md="12" lg="4">
															<v-text-field
																v-model="editedItem.document"
																label="DNI"
																prepend-icon="mdi-tag"
																hide-details
																dense
																maxLength="8"
																color="primary"
																placeholder="Ingrese DNI"
															></v-text-field>
														</v-col>
														<v-col cols="12" sm="12" md="12" lg="4">
															<v-text-field
																v-model="editedItem.cellphone"
																label="Celular"
																prepend-icon="mdi-phone"
																hide-details
																dense
																maxLength="9"
																type="tel"
																color="primary"
																placeholder="Ingrese celular"
															></v-text-field>
														</v-col>
														<v-col cols="12" sm="12" md="12" lg="8">
															<v-text-field
																v-model="editedItem.email"
																label="Email"
																prepend-icon="mdi-at"
																hide-details
																dense
																type="email"
																color="primary"
																placeholder="Ingrese email"
															></v-text-field>
														</v-col>
														<v-col cols="12" sm="12" md="12" lg="4">
															<v-select
																v-model="editedItem.tipo"
																:items="listaTipos"
																label="Tipo"
																item-text="text"
																prepend-icon="mdi-web"
																hide-details
																color="primary"
																dense
																:menu-props="{ bottom: true, offsetY: true }"
															>
																<template v-slot:selection="data">
																	<v-chip color="primary" x-small v-text="data.item.text"></v-chip>
																</template>
																<template v-slot:item="data">
																	<v-list-item-avatar>
																		<v-icon color="primary">{{ data.item.icon }}</v-icon>
																	</v-list-item-avatar>
																	<v-list-item-content>
																		<v-list-item-title
																			v-html="data.item.text"
																		></v-list-item-title>
																	</v-list-item-content>
																</template>
															</v-select>
														</v-col>
														<v-col cols="12" sm="12" md="12" lg="4">
															<v-select
																v-model="marcaSeleccionada"
																:items="listaMarcas"
																prepend-icon="mdi-tag"
																label="Marca"
																item-text="name"
																hide-details
																dense
																color="primary"
																:menu-props="{ bottom: true, offsetY: true }"
															>
																<template v-slot:selection="data">
																	<v-chip
																		x-small
																		color="primary"
																		dark
																		v-text="data.item.name"
																	></v-chip>
																</template>
																<template v-slot:item="data">
																	<v-list-item-avatar size="30">
																		<v-img :src="data.item.avatar" contain></v-img>
																	</v-list-item-avatar>
																	<v-list-item-content>
																		<v-list-item-title v-html="data.item.name">
																		</v-list-item-title>
																	</v-list-item-content>
																</template>
															</v-select>
														</v-col>
														<v-col cols="12" sm="12" md="12" lg="4">
															<v-select
																v-model="sucursalSeleccionada"
																:items="listaSucursales"
																item-text="name"
																label="Sucursal"
																prepend-icon="mdi-domain"
																hide-details
																dense
																color="primary"
																:menu-props="{ bottom: true, offsetY: true }"
															>
																<template v-slot:selection="data">
																	<v-chip
																		dark
																		:color="colorSucursal(data.item.name)"
																		x-small
																		v-text="data.item.name"
																	>
																	</v-chip>
																</template>
																<template v-slot:item="data">
																	<v-list-item-avatar>
																		<v-avatar
																			size="32"
																			class="white--text"
																			:color="colorSucursal(data.item.name)"
																			v-text="obtenerSuc(data.item.name)"
																		></v-avatar>
																	</v-list-item-avatar>
																	<v-list-item-content>
																		<v-list-item-title
																			v-html="data.item.name"
																		></v-list-item-title>
																	</v-list-item-content>
																</template>
															</v-select>
														</v-col>
														<v-col cols="12" sm="12" md="12" lg="12">
															<v-switch
																v-model="editedItem.status"
																dense
																hide-details
																flat
																color="primary"
																prepend-icon="mdi-check"
																:label="editedItem.status ? 'Activo' : 'Inactivo'"
															></v-switch>
														</v-col>
													</v-row>
												</v-container>
											</v-card-text>
											<v-card-actions>
												<v-spacer></v-spacer>
												<v-btn text color="primary" @click="closeDialogSeller">Cancelar</v-btn>
												<v-btn dark color="secondary" @click="guardarItem">Guardar</v-btn>
											</v-card-actions>
										</v-card>
									</v-dialog>
								</v-col>
							</v-row>
							<v-dialog v-model="dialogPhoto" persistent max-width="500" transition="dialog-bottom-transition">
								<v-card elevation="10">
									<v-card-title class="text-uppercase display-1 fondoTitulo">Subir Avatar</v-card-title>
									<v-card-text>
										<v-container>
											<v-row>
												<v-col cols="12" sm="12" md="12" lg="12">
													<v-file-input
														v-model="avatar"
														show-size
														label="Avatar de Vendedor"
														prepend-icon="mdi-camera"
														counter
														small-chips
														placeholder="Selecciona un avatar"
													></v-file-input>
												</v-col>
												<v-col cols="12" sm="12" md="12" lg="12">
													<v-card class="mx-auto" elevation="1" max-width="300">
														<v-card-title class="text-uppercase fondoTitulo">Preview</v-card-title>
														<v-card-text>
															<v-container>
																<v-img :src="urlPreview" max-width="250"></v-img>
															</v-container>
														</v-card-text>
													</v-card>
												</v-col>
											</v-row>
										</v-container>
									</v-card-text>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn text color="primary" @click="closeDialogPhoto">Cancelar</v-btn>
										<v-btn dark color="secondary" @click="uploadPhoto">Subir</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</v-toolbar>
					</template>
					<template v-slot:item.name="{ item }">
						<v-avatar size="60">
							<v-img :src="item.avatar"></v-img>
						</v-avatar>
						<span class="ml-1">{{ item.name }}</span>
					</template>
					<template v-slot:item.marcaAvatar="{ item }">
						<v-avatar size="80">
							<v-img :src="item.marcaAvatar" contain></v-img>
						</v-avatar>
					</template>
					<template v-slot:item.status="{ item }">
						<v-chip small dark :color="procesarStatus(item.status)" v-text="item.status ? 'ACTIVO' : 'INACTIVO'"></v-chip>
					</template>
					<template v-slot:item.actions="{ item }">
						<v-btn fab dark x-small color="purple accent-2" @click="subirFoto(item)">
							<v-icon>mdi-cloud-upload</v-icon>
						</v-btn>
						<v-btn fab dark x-small color="blue accent-2" class="mx-1" @click="verItem(item)">
							<v-icon>mdi-eye</v-icon>
						</v-btn>
						<v-btn fab dark x-small color="primary" @click="eliminarItem(item)">
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
import * as pro from "../../../plugins/helper";
import Swal from "sweetalert2";

export default {
	data() {
		return {
			totalSellers: 0,
			totalSellersActive: 0,
			search: "",
			contador: 0,
			dialogSeller: false,
			dialogPhoto: false,
			page: 1,
			pageCount: 0,
			itemsPerPage: 20,
			headerTable: [
				{ text: "Sucursal", value: "sucursal", align: "center", sortable: false, groupable: true, class: "text-h6 text-uppercase" },
				{ text: "Vendedor", value: "name", align: "left", sortable: true, groupable: false, class: "text-h6 text-uppercase" },
				{ text: "Representa", value: "marcaAvatar", align: "center", sortable: false, groupable: true, class: "text-h6 text-uppercase" },
				// { text: "DNI", value: "document", align: "center", sortable: false, groupable: false, class: "text-h6 text-uppercase" },
				{ text: "Celular", value: "cellphone", align: "center", sortable: false, groupable: false, class: "text-h6 text-uppercase" },
				{ text: "Email", value: "email", align: "center", sortable: false, groupable: false, class: "text-h6 text-uppercase" },
				{ text: "Tipo", value: "tipo", align: "center", sortable: false, groupable: false, class: "text-h6 text-uppercase" },
				{ text: "Estado", value: "status", align: "center", sortable: false, groupable: false, class: "text-h6 text-uppercase" },
				{ text: "Acciones", value: "actions", align: "center", sortable: false, groupable: false, class: "text-h6 text-uppercase" },
			],
			contentTable: [],
			editedIndex: -1,
			editedItem: {
				name: "",
				document: "",
				cellphone: "",
				email: "",
				tipo: "",
				marca: "",
				sucursal: "",
				avatar: "",
				status: true,
				createdBy: "",
			},
			defaultItem: {
				name: "",
				document: "",
				cellphone: "",
				email: "",
				tipo: "",
				marca: "",
				sucursal: "",
				avatar: "",
				status: true,
				createdBy: "",
			},
			avatar: null,
			//API MARCA
			marcaSeleccionada: "",
			listaMarcas: [],
			//API SUCURSAL
			sucursalSeleccionada: "",
			listaSucursales: [],
			//API TIPOS
			listaTipos: [
				{ text: "SHOWROOM", icon: "mdi-domain" },
				{ text: "WEB", icon: "mdi-web" },
			],
		};
	},

	computed: {
		...mapState(["user"]),

		titleDialog() {
			return this.editedIndex === -1 ? "Nuevo vendedor" : "Actualizar vendedor";
		},

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

		urlPreview() {
			if (!this.avatar) return;
			return URL.createObjectURL(this.avatar);
		},
	},

	watch: {
		dialogSeller(val) {
			val || this.closeDialogSeller();
		},

		dialogPhoto(val) {
			val || this.closeDialogPhoto();
		},
	},

	created() {
		this.inicializar();
	},

	methods: {
		...mapActions(["detectarUsuario"]),

		inicializar() {
			this.detectarUsuario(this.userConectado);
			this.cargarData();
			this.cargarBoxes();
			this.initContadores();
		},

		cargarBoxes() {
			this.getAllSucursales();
			this.getAllMarcas();
		},

		refreshData() {
			pro.limpiarTabla(this.contentTable);
			this.cargarData();
			this.initContadores();
		},

		initContadores() {
			this.getAllActiveSellers();
		},

		contadorItems(pagination) {
			this.contador = pagination.itemsLength;
		},

		closeDialogSeller() {
			this.dialogSeller = false;
			this.$nextTick(() => {
				this.editedIndex = -1;
				this.editedItem = Object.assign({}, this.defaultItem);
				this.marcaSeleccionada = "";
				this.sucursalSeleccionada = "";
			});
		},

		closeDialogPhoto() {
			this.dialogPhoto = false;
			this.$nextTick(() => {
				this.editedIndex = -1;
				this.editedItem = Object.assign({}, this.defaultItem);
				this.avatar = null;
			});
		},

		async cargarData() {
			try {
				const query = await axios.get("sellers");
				if (query.status == 200) {
					this.totalSellers = query.data.total_sellers;
					await query.data.all_sellers.forEach((element) => {
						let obj = {};

						obj.codigo = element._id;
						obj.name = element.name;
						obj.document = element.document;
						obj.cellphone = element.cellphone;
						obj.email = element.email;
						obj.tipo = element.tipo;
						obj.marca = pro.validarVacios(element.marca) ? '-' : element.marca.name;
						obj.marcaAvatar = pro.validarVacios(element.marca) ? '' : element.marca.avatar;
						obj.sucursal = pro.validarVacios(element.sucursal) ? '' : element.sucursal.name;
						obj.avatar = element.avatar;
						obj.status = element.status;
						obj.createdBy = pro.validarVacios(element.createdBy) ? '-' : element.createdBy.name;

						this.contentTable.push(obj);
					});
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		async getAllSucursales() {
			try {
				const query = await axios.get("sucursal/activos");
				if (query.status == 200) {
					this.listaSucursales = query.data.active_sucursals;
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		async getAllMarcas() {
			try {
				const query = await axios.get("brands/activos");
				if (query.status == 200) {
					this.listaMarcas = query.data.active_brands;
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		async getAllActiveSellers() {
			try {
				const query = await axios.get("sellers/activos");
				if (query.status == 200) {
					this.totalSellersActive = query.data.total_actives;
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		procesarStatus(status) {
			if (status) return "green darken-2";
			else return "red darken-4";
		},

		colorSucursal(item) {
			return pro.colorearSucursal(item);
		},

		obtenerSuc(item) {
			return pro.abreviaturaSucursal(item);
		},

		async guardarItem() {
			if (this.editedIndex > -1) {
				// console.log("editar item");
				let id = this.editedItem.codigo;
				this.editedItem.marca = this.marcaSeleccionada;
				this.editedItem.sucursal = this.sucursalSeleccionada;

				try {
					const query = await axios.patch("sellers/" + id, this.editedItem);

					if (query.status == 200) {
						pro.alertaExitosa(query.data.message);
						this.refreshData();
						this.closeDialogSeller();
					}
				} catch (err) {
					pro.capturarError(err.response);
				}
			} else {
				// console.log("nuevo item");

				const employee = await axios.get("users/" + this.$store.state.user.userCod);

				let newObj = {
					name: this.editedItem.name,
					document: this.editedItem.document,
					cellphone: this.editedItem.cellphone,
					email: this.editedItem.email,
					tipo: this.editedItem.tipo,
					marca: this.marcaSeleccionada,
					sucursal: this.sucursalSeleccionada,
					status: this.editedItem.status,
					createdBy: employee.data.founded.username,
				};

				if (this.validarCamposVacios(newObj)) {
					try {
						const query = await axios.post("sellers", newObj);

						if (query.status == 200) {
							pro.alertaExitosa(query.data.message);
							this.refreshData();
							this.closeDialogSeller();
						}
					} catch (err) {
						pro.capturarError(err.response);
					}
				}
			}
		},

		validarCamposVacios(item) {
			let msg = [];
			if (item.name == null || item.name == "" || item.name == undefined) {
				msg.push("Colaborador");
			}
			if (item.tipo == null || item.tipo == "" || item.tipo == undefined) {
				msg.push("Tipo");
			}
			if (item.marca == null || item.marca == "" || item.marca == undefined) {
				msg.push("Marca");
			}
			if (item.sucursal == null || item.sucursal == "" || item.sucursal == undefined) {
				msg.push("Sucursal");
			}
			if (msg.length > 0) {
				pro.alertaCamposVacios(msg);
				return false;
			} else {
				return true;
			}
		},

		verItem(item) {
			this.editedIndex = this.contentTable.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.marcaSeleccionada = this.editedItem.marca;
			this.sucursalSeleccionada = this.editedItem.sucursal;
			this.dialogSeller = !this.dialogSeller;
		},

		subirFoto(item) {
			this.editedIndex = this.contentTable.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.marcaSeleccionada = this.editedItem.marca;
			this.sucursalSeleccionada = this.editedItem.sucursal;
			this.dialogPhoto = !this.dialogPhoto;
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
						const query = await axios.delete("sellers/" + id);
						if (query.status == 200) {
							pro.alertaExitosa(query.data.message);
							this.refreshData();
						}
					} catch (err) {
						pro.capturarError(err.response);
					}
				}
			});
		},

		async uploadPhoto() {
			let id = this.editedItem.codigo;

			const formData = new FormData();
			formData.append("avatar", this.avatar);

			if (this.avatar == null || this.avatar == undefined) {
				pro.alertaCamposVacios("Suba un avatar");
			} else {
				try {
					const query = await axios.patch("sellers/upload/" + id, formData);
					if (query.status == 200) {
						pro.alertaExitosa(query.data.message);
						this.refreshData();
						this.closeDialogPhoto();
					}
				} catch (err) {
					pro.capturarError(err.response);
				}
			}
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
