<template>
	<div class="mx-5 my-5">
		<v-row>
			<v-col cols="12" sm="6" md="6" lg="4">
				<base-material-stats-card
					v-model="totalVehiculos"
					color="primary"
					icon="mdi-tag"
					value="0"
					title="TOTAL"
				></base-material-stats-card>
			</v-col>
			<v-col cols="12" sm="6" md="6" lg="4">
				<base-material-stats-card
					v-model="totalModelos"
					color="primary"
					icon="mdi-tag"
					value="0"
					title="MODELOS"
				></base-material-stats-card>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" sm="12" md="12" lg="12">
				<v-data-iterator
					:items="contentTable"
					:search="search"
					class="elevation-5"
					group-by="model"
					:loading="contentTable.length > 0 ? false : true"
					loading-text="Cargando Modelos"
					:items-per-page="itemsPerPage"
					:page.sync="page"
					hide-default-footer
					@pagination="contadorItems"
				>
					<template v-slot:header>
						<v-toolbar flat color="primary" height="150" rounded>
							<v-row>
								<v-col :cols="$vuetify.breakpoint.xs ? '2' : '1'">
									<v-avatar color="white" size="32" class="primary--text font-weight-bold" v-text="contador"></v-avatar>
								</v-col>
								<v-col :cols="$vuetify.breakpoint.xs ? '9' : '4'">
									<v-toolbar-title class="mx-5 text-h4 text-uppercase white--text">Vehículos</v-toolbar-title>
								</v-col>
								<v-spacer v-if="$vuetify.breakpoint.xs ? false : true"></v-spacer>
								<v-col :cols="$vuetify.breakpoint.xs ? '9' : '6'">
									<v-text-field
										v-model="search"
										prepend-inner-icon="mdi-magnify"
										label="Buscar..."
										hide-details
										dense
										dark
										clearable
										outlined
										rounded
									></v-text-field>
								</v-col>
								<v-col :cols="$vuetify.breakpoint.xs ? '1' : '1'">
									<v-dialog v-model="dialogVehiculo" persistent max-width="600" transition="dialog-bottom-transition">
										<template v-slot:activator="{ attrs, on }">
											<v-btn small fab dark color="primary" class="mx-5" v-bind="attrs" v-on="on">
												<v-icon>mdi-plus</v-icon>
											</v-btn>
										</template>
										<v-card elevation="5">
											<v-card-title class="text-h4 text-uppercase fondoTitulo" v-text="titleDialog"></v-card-title>
											<v-card-text>
												<v-container>
													<v-row>
														<v-col cols="12" sm="12" md="12" lg="5">
															<v-select
																v-model="marcaSeleccionada"
																:items="listaMarcas"
																prepend-icon="mdi-tag"
																label="Marca"
																item-text="name"
																hide-details
																color="primary"
																:menu-props="{ bottom: true, offsetY: true }"
																v-on:change="getAllModelos(marcaSeleccionada)"
															>
																<template v-slot:selection="data">
																	<v-chip
																		small
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
														<v-col cols="12" sm="12" md="12" lg="7">
															<v-select
																v-model="chasisSeleccionado"
																:items="listaChasis"
																name="chasisSeleccionado"
																item-text="name"
																:menu-props="{ bottom: true, offsetY: true }"
																prepend-icon="mdi-group"
																label="Categoria de Chasis"
																small-chips
																deletable-chips
																color="primary"
																hide-details
															>
																<template v-slot:selection="data">
																	<v-chip color="primary" small v-text="data.item.name"></v-chip>
																</template>
															</v-select>
														</v-col>
														<v-col cols="12" sm="12" md="12" lg="5">
															<v-text-field
																v-model="editedItem.cod_tdp"
																prepend-icon="mdi-barcode"
																type="number"
																label="COD TDP"
																color="primary"
																hide-details
															></v-text-field>
														</v-col>
														<v-col cols="12" sm="12" md="12" lg="7">
															<v-autocomplete
																v-model="modeloSeleccionado"
																:items="listaModelos"
																item-text="name"
																label="Modelo"
																prepend-icon="mdi-car"
																:menu-props="{ bottom: true, offsetY: true }"
																hide-details
																color="primary"
															>
																<template v-slot:selection="data">
																	<v-chip
																		small
																		color="primary"
																		dark
																		v-text="data.item.name"
																	></v-chip>
																</template>
																<template v-slot:item="data">
																	<v-list-item-avatar size="80">
																		<v-img :src="data.item.avatar" contain></v-img>
																	</v-list-item-avatar>
																	<v-list-item-content>
																		<v-list-item-title v-html="data.item.name">
																		</v-list-item-title>
																	</v-list-item-content>
																</template>
															</v-autocomplete>
														</v-col>
														<v-col cols="12" sm="12" md="12" lg="12">
															<v-text-field
																v-model="editedItem.version"
																prepend-icon="mdi-car-pickup"
																label="Version"
																color="primary"
																hide-details
															></v-text-field>
														</v-col>
													</v-row>
												</v-container>
											</v-card-text>
											<v-card-actions>
												<v-spacer></v-spacer>
												<v-btn text color="primary" @click="closeDialogVehiculo"> Cancelar </v-btn>
												<v-btn dark color="secondary" @click="guardarItem"> Guardar </v-btn>
											</v-card-actions>
										</v-card>
									</v-dialog>
								</v-col>
							</v-row>
						</v-toolbar>
					</template>
					<template v-slot:default="data">
						<div class="mx-5 my-5">
							<v-row>
								<v-col v-for="item in data.items" :key="item.name" cols="12" sm="6" md="4" lg="3">
									<v-card max-width="280" class="mx-auto" outlined>
										<v-img
											:src="item.modeloAvatar"
											height="200"
											contain
											class="white--text align-end"
											gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
										>
											<v-card-title>
												<v-chip color="primary" dark v-text="item.model"></v-chip>
											</v-card-title>
										</v-img>
										<v-divider></v-divider>
										<v-card-subtitle class="text-center">
											<span class="font-weight-bold">{{ item.version }}</span>
										</v-card-subtitle>
										<v-divider></v-divider>
										<v-card-text>
											<v-row>
												<v-col cols="12" sm="12" md="6" lg="6" class="d-flex">
													<v-avatar size="30">
														<v-img :src="item.marcaAvatar" contain></v-img>
													</v-avatar>
												</v-col>
												<v-col cols="12" sm="12" md="6" lg="6" class="d-flex">
													<v-chip color="accent" dark class="ml-auto" v-text="item.chasis"></v-chip>
												</v-col>
											</v-row>
										</v-card-text>
										<v-divider></v-divider>
										<v-card-actions>
											<v-chip small dark color="primary" v-text="item.cod_tdp"></v-chip>
											<v-spacer></v-spacer>
											<v-btn icon @click="verItem(item)">
												<v-icon color="orange">mdi-eye</v-icon>
											</v-btn>
											<v-btn icon @click="eliminarItem(item)">
												<v-icon color="primary">mdi-delete</v-icon>
											</v-btn>
										</v-card-actions>
									</v-card>
								</v-col>
							</v-row>
						</div>
					</template>
					<template v-slot:footer>
						<v-row class="mt-2" align="center" justify="center">
							<v-spacer></v-spacer>
							<span class="mr-5 grey--text">Página {{ page }} de {{ numberOfPage }}</span>
							<v-btn fab small dark color="primary" class="mr-1 mb-5" @click="paginaAnterior">
								<v-icon>mdi-chevron-left</v-icon>
							</v-btn>
							<v-btn fab small dark color="primary" class="mr-5 mb-5" @click="paginaSiguiente">
								<v-icon>mdi-chevron-right</v-icon>
							</v-btn>
						</v-row>
					</template>
				</v-data-iterator>
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
			totalVehiculos: 0,
			totalModelos: 0,
			dialogVehiculo: false,
			search: "",
			contador: 0,
			page: 1,
			pageCount: 0,
			itemsPerPage: 16,
			contentTable: [],
			editedIndex: -1,
			editedItem: {
				chasis: "",
				model: "",
				cod_tdp: "",
				version: "",
				createdBy: "",
			},
			defaultItem: {
				chasis: "",
				model: "",
				cod_tdp: "",
				version: "",
				createdBy: "",
			},
			//API MARCAS
			marcaSeleccionada: "",
			listaMarcas: [],
			//API CHASIS
			chasisSeleccionado: "",
			listaChasis: [],
			//API MODELO
			modeloSeleccionado: "",
			listaModelos: [],
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
			return this.editedIndex === -1 ? "Nuevo Vehículo" : "Actualizar Vehículo";
		},

		numberOfPage() {
			return Math.ceil(this.contentTable.length / this.itemsPerPage);
		},
	},

	watch: {
		dialogVehiculo(val) {
			val || this.closeDialogVehiculo();
		},
	},

	created() {
		this.detectarUsuario(this.userConectado);
		this.inicializar();
	},

	methods: {
		...mapActions(["detectarUsuario"]),

		inicializar() {
			this.cargarData();
			this.getTotalModelos();
			this.initCombos();
		},

		initCombos() {
			this.getAllMarcas();
			this.getAllChasis();
		},

		refreshData() {
			pro.limpiarTabla(this.contentTable);
			this.cargarData();
			this.getTotalModelos();
		},

		contadorItems(pagination) {
			this.contador = pagination.itemsLength;
		},

		closeDialogVehiculo() {
			this.dialogVehiculo = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
				this.marcaSeleccionada = "";
				this.chasisSeleccionado = "";
				this.modeloSeleccionado = "";
			});
		},

		async cargarData() {
			try {
				const query = await axios.get("vehicles");
				if (query.status == 200) {
					this.totalVehiculos = query.data.total;
					await query.data.all_vehicles.forEach((element) => {
						let obj = {};

						obj.codigo = element._id;
						obj.chasis = pro.validarVacios(element.chasis) ? '' : element.chasis.name;
						obj.model = pro.validarVacios(element.model) ? '' : element.model.name;
						obj.modeloAvatar = pro.validarVacios(element.model) ? '' : element.model.avatar;
						obj.marca = pro.validarVacios(element.model) ? '' : element.model.marca.name;
						obj.marcaAvatar = pro.validarVacios(element.model) ? '' : element.model.marca.avatar;
						obj.cod_tdp = element.cod_tdp;
						obj.version = element.version;
						obj.createdBy = pro.validarVacios(element.createdBy) ? '-' : element.createdBy.name;

						this.contentTable.push(obj);
					});
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		async getTotalModelos() {
			try {
				const query = await axios.get("models/count");
				if (query.status == 200) {
					this.totalModelos = query.data.total;
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		paginaAnterior() {
			if (this.page - 1 <= this.numberOfPage) this.page -= 1;
		},

		paginaSiguiente() {
			if (this.page + 1 <= this.numberOfPage) this.page += 1;
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

		async getAllChasis() {
			try {
				const query = await axios.get("chasis/activos");
				if (query.status == 200) {
					this.listaChasis = query.data.chasis_activos;
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		async getAllModelos(byMarca) {
			let obj = {};

			obj.marca = byMarca;
			try {
				const query = await axios.post("models/by-marca", obj);
				if (query.status == 200) {
					this.listaModelos = query.data.models;
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		verItem(item) {
			this.editedIndex = this.contentTable.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.marcaSeleccionada = this.editedItem.marca;
			this.getAllModelos(this.marcaSeleccionada);
			this.modeloSeleccionado = this.editedItem.model;
			this.chasisSeleccionado = this.editedItem.chasis;
			this.dialogVehiculo = !this.dialogVehiculo;
		},

		async eliminarItem(item) {
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
						const query = await axios.delete("vehicles/" + id);
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

		async guardarItem() {
			if (this.editedIndex > -1) {
				// console.log('Editar item');
				let id = this.editedItem.codigo;

				this.editedItem.marca = this.marcaSeleccionada;
				this.editedItem.chasis = this.chasisSeleccionado;
				this.editedItem.model = this.modeloSeleccionado;
				try {
					const query = await axios.patch("vehicles/" + id, this.editedItem);

					if (query.status == 200) {
						pro.alertaExitosa(query.data.message);
						this.closeDialogVehiculo();
						this.refreshData();
					}
				} catch (err) {
					pro.capturarError(err.response);
				}
			} else {
				// console.log('Nuevo item');
				const employee = await axios.get("users/" + this.$store.state.user.userCod);

				let newObj = {
					cod_tdp: this.editedItem.cod_tdp,
					chasis: this.chasisSeleccionado,
					model: this.modeloSeleccionado,
					version: this.editedItem.version,
					createdBy: employee.data.founded.username,
				};

				if (this.validarCamposVacios(newObj)) {
					try {
						const query = await axios.post("vehicles", newObj);
						if (query.status == 200) {
							pro.alertaExitosa(query.data.message);
							this.refreshData();
							this.closeDialogVehiculo();
						}
					} catch (err) {
						pro.capturarError(err.response);
					}
				}
			}
		},

		validarCamposVacios(item) {
			let msg = [];

			if (item.version == "" || item.version == null || item.version == undefined) {
				msg.push("Versión");
			}
			if (item.cod_tdp == "" || item.cod_tdp == null || item.cod_tdp == undefined) {
				msg.push("COD TDP");
			}

			if (msg.length > 0) {
				pro.alertaCamposVacios(msg);
				return false;
			} else {
				return true;
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
