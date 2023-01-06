<template>
	<div class="mx-5 my-5">
		<v-row>
			<v-col cols="12" sm="12" md="12" lg="12">
				<import-data :on-success="handleSuccess" :before-upload="beforeUpload" />
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" sm="12" md="12" lg="12">
				<v-data-table
					:headers="headerTable"
					:items="contentTable"
					:search="search"
					class="elevation-1"
					:loading="contentTable.length > 0 ? false : true"
					loading-text="Importe el archivo excel"
					hide-default-footer
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@pagination="contadordeItems"
					@page-count="pageCount = $event"
				>
					<template v-slot:top>
						<v-toolbar height="150" flat>
							<v-row>
								<v-col :cols="$vuetify.breakpoint.xs ? '2' : '1'" class="text-center">
									<v-avatar size="48" color="primary" class="white--text" v-text="contador"></v-avatar>
								</v-col>
								<v-col :cols="$vuetify.breakpoint.xs ? '9' : '4'">
									<v-toolbar-title class="text-h3 text-uppercase primary--text mx-1">Clientes</v-toolbar-title>
								</v-col>
								<v-spacer v-if="$vuetify.breakpoint.xs ? false : true"></v-spacer>
								<v-col :cols="$vuetify.breakpoint.xs ? '9' : '6'">
									<v-text-field
										v-model="search"
										label="Buscar..."
										prepend-inner-icon="mdi-magnify"
										hide-details
										color="primary"
										outlined
										rounded
									></v-text-field>
								</v-col>
								<v-col :cols="$vuetify.breakpoint.xs ? '1' : '1'">
									<v-dialog v-model="dialogConfirmacion" persistent max-width="500" transition="dialog-bottom-transition">
										<template v-slot:activator="{ attrs, on }">
											<v-btn large fab color="primary" dark class="mx-1" v-bind="attrs" v-on="on">
												<v-icon>mdi-content-save</v-icon>
											</v-btn>
										</template>
										<v-card outlined flat>
											<v-card-title class="text-h3 text-uppercase fondoTitulo">Confirmación</v-card-title>
											<v-card-text>
												<div class="mx-5 my-5">
													<v-row>
														<v-col cols="12" sm="12" md="12" lg="12">
															<v-select
																v-model="originSeleccionado"
																:items="listaOrigenes"
																label="Origen"
																item-text="name"
																prepend-inner-icon="mdi-web"
																hide-details
																placeholder="Seleccione origen"
																:menu-props="{ bottom: true, offsetY: true }"
																outlined
																dense
																clearable
															>
																<template v-slot:selection="{item}">
																	<v-chip dark small color="primary" v-text="item.name"></v-chip>
																</template>
																<template v-slot:item="{ active, item, attrs, on }">
                                                                    <v-list-item v-on="on" v-bind="attrs" #default="{ active }">
																		<v-list-item-action>
                                                                            <v-checkbox :input-value="active"></v-checkbox>
                                                                        </v-list-item-action>
                                                                        <v-list-item-content>
                                                                            <v-list-item-title v-html="item.name"></v-list-item-title>
                                                                        </v-list-item-content>
                                                                        
                                                                    </v-list-item>
                                                                </template>
															</v-select>
														</v-col>
														<v-col cols="12" sm="12" md="12" lg="12">
															<v-select
																v-model="marcaSeleccionada"
																:items="listaMarcas"
																item-text="name"
																item-value="name"
																label="Marca"
																hide-details
																prepend-inner-icon="mdi-tag"
																placeholder="Seleccione Marca"
																:menu-props="{ bottom: true, offsetY: true}"
																outlined
																dense
																clearable
															>
																<template v-slot:selection="{item}">
																	<v-chip dark small color="primary" v-text="item.name"></v-chip>
																</template>
																<template v-slot:item="{ active, item, attrs, on }">
                                                                    <v-list-item v-on="on" v-bind="attrs" #default="{ active }">
																		<v-list-item-action>
                                                                            <v-checkbox :input-value="active"></v-checkbox>
                                                                        </v-list-item-action>
                                                                        <v-list-item-content>
                                                                            <v-list-item-title v-html="item.name"></v-list-item-title>
                                                                        </v-list-item-content>
                                                                        <v-list-item-avatar :size="80">
																			<v-img :src="item.avatar" :lazy-src="item.avatar" contain></v-img>
																		</v-list-item-avatar>
                                                                    </v-list-item>
                                                                </template>
															</v-select>
														</v-col>
													</v-row>
												</div>
											</v-card-text>
											<v-card-actions>
												<v-spacer></v-spacer>
												<v-btn color="primary" @click="closeDialogConfirmacion">Cancelar</v-btn>
												<v-btn color="secondary" :loading="loading" :disabled="loading" @click="loader = 'loading'">
													Guardar
													<template v-slot:loader>
														<span class="custom-loader">
															<v-icon>mdi-cached</v-icon>
														</span>
													</template>
												</v-btn>
											</v-card-actions>
										</v-card>
									</v-dialog>
								</v-col>
							</v-row>
						</v-toolbar>
					</template>
				</v-data-table>
				<div class="text-center py-3">
					<v-pagination v-model="page" :length="pageCount" :total-visible="8" circle></v-pagination>
				</div>
			</v-col>
		</v-row>
	</div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import ImportData from "../../../components/ImportData";
import * as pro from "../../../plugins/helper";

export default {
	components: { ImportData },

	data() {
		return {
			loader: null,
			loading: false,
			search: "",
			contador: 0,
			itemsPerPage: 100,
			page: 1,
			pageCount: 0,
			dialogConfirmacion: false,
			//   excelData:{
			headerTable: [
				{ text: "Cliente", value: "full_name", align: "center", sortable: false, groupable: false },
				{ text: "DNI", value: "dni", align: "center", sortable: false, groupable: false },
				{ text: "Ciudad", value: "city", align: "center", sortable: false, groupable: false },
				{ text: "Celular", value: "phone_number", align: "center", sortable: false, groupable: false },
				{ text: "Email", value: "email", align: "center", sortable: false, groupable: false },
			],
			contentTable: [],
			//   },
			//API ORIGEN
			originSeleccionado: "",
			listaOrigenes: [],
			// API MARCA
			marcaSeleccionada: '',
			listaMarcas: [],
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
	},

	watch: {
		dialogConfirmacion(val) {
			val || this.closeDialogConfirmacion();
		},

		loader(val){ 
			let l = this.loader;
			this[l] = !this[l];

			val && setTimeout(() => {
				this[l] = false;
				console.log('Empieza en 5 seg');
			},5000);

			val && setTimeout(async () => {
				await this.guardarItems();
				console.log('Empieza en 1 seg');
			},1000);

			this.loader = null;
		}
	},

	created() {
		this.detectarUsuario(this.userConectado);
		this.initCombos();
	},

	methods: {
		...mapActions(["detectarUsuario"]),
		contadordeItems(pagination) {
			this.contador = pagination.itemsLength;
		},

		initCombos() {
			this.getAllOriginActive();
			this.getComboMarcaActive();
		},

		closeDialogConfirmacion() {
			this.dialogConfirmacion = false;
		},

		beforeUpload(file) {
			const isFile1M = file.size / 1024 / 1024 < 1;
			if (isFile1M) {
				return true;
			}

			this.$message({
				message: "Please do not upload files larger than 1M in size",
				type: "warning",
			});
			return false;
		},

		handleSuccess({ results }) {
			this.contentTable = results;
		},

		async getAllOriginActive() {
			try {
				const query = await axios.get("origin/activos");
				if (query.status == 200) {
					this.listaOrigenes = query.data.active_origins;
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		async getComboMarcaActive() {
			try {
				const query = await axios.get("brands/activos");
				// console.log(query);
				if (query.status == 200) {
					this.listaMarcas = query.data.active_brands.filter(a => (a.name == 'TOYOTA' || a.name == 'HINO'));
				}
				// console.log(this.listaMarcas);
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		async guardarItems() {
			if (this.contentTable.length > 0) {
				const employee = await axios.get("users/" + this.$store.state.user.userCod);
                
                //Tabla
                let contador = 1;
                let tamanio = this.contentTable.length;

                await this.contentTable.forEach( async element => {
                    
                    let obj = {};

                    obj.dataOrigin = this.originSeleccionado;
					obj.marcaVehiculo = this.marcaSeleccionada;
					obj.marcaVehiculoE = this.marcaSeleccionada;
                    obj.customer_name = element.full_name;
                    obj.customer_document = element.dni;
                    obj.customer_city = element.city;
                    obj.customer_cellphone = element.phone_number.substr(3);
                    obj.customer_cellphone2 = '';
                    obj.customer_email = element.email;
                    obj.fecha_ingreso = pro.formatearFecha(new Date(), true);
                    obj.createdBy = employee.data.founded.username;

                    try {
                        const query = await axios.post('leads', obj);
                        if(query.status == 200){
                            if(contador == tamanio){
                                pro.alertaExitosa(`Importación completa de ${tamanio} elementos`);
                                this.irVistaLeads();
                            }
                        }
                    } catch (err) {
                        pro.capturarError(err.response);
                    }

                    contador++;
                });
            } else {
				pro.alertaAdvertencia("Falta importar el archivo");
			}
		},

		irVistaLeads() {
            this.$router.push('/leads/list');
        },
	},
};
</script>
<style>
.fondoTitulo {
	background-color: #d50000;
	color: white;
}

.custom-loader {
	animation: loader 1s infinite;
	display: flex;
}

@-moz-keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}

@-webkit-keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}

@-o-keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}

@keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
