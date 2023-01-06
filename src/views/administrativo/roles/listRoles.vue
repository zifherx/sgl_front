<template>
	<div class="mx-5 my-5">
		<v-row>
			<v-col cols="12" sm="6" md="4" lg="4">
				<base-material-stats-card v-model="totalRoles" color="primary" icon="mdi-tag" value="0" title="TOTAL"></base-material-stats-card>
			</v-col>
			<v-col cols="12" sm="6" md="4" lg="4">
				<base-material-stats-card
					v-model="activeRoles"
					color="primary"
					icon="mdi-tag"
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
					class="elevation-1"
					hide-default-footer
					show-group-by
					:loading="msg_nodata.length > 0 ? true : false"
					loading-text="Cargando datos"
					:items-per-page="itemsPerPage"
					:page.sync="page"
					@pagination="contadorItems"
					@page-count="pageCount = $event"
				>
					<template v-slot:top>
						<v-toolbar height="150" flat>
							<v-row>
								<v-col :cols="$vuetify.breakpoint.xs ? '2' : '1'" class="text-center">
									<v-avatar v-text="contador" class="white--text" color="primary"></v-avatar>
								</v-col>
								<v-col :cols="$vuetify.breakpoint.xs ? '9' : '4'">
									<v-toolbar-title class="text-uppercase display-1 mx-5">Roles</v-toolbar-title>
								</v-col>
								<v-spacer v-if="$vuetify.breakpoint.xs ? false : true"></v-spacer>
								<v-col :cols="$vuetify.breakpoint.xs ? '9' : '6'">
									<v-text-field
										v-model="search"
										prepend-inner-icon="mdi-magnify"
										outlined
										rounded
										hide-details
										label="Buscar..."
										class="mx-5"
									></v-text-field>
								</v-col>
								<v-col :cols="$vuetify.breakpoint.xs ? '1' : '1'">
									<v-dialog v-model="dialogRol" persistent max-width="500" transition="dialog-bottom-transition">
										<template v-slot:activator="{ attrs, on }">
											<v-btn fab color="primary" dark v-bind="attrs" v-on="on">
												<v-icon large>mdi-plus</v-icon>
											</v-btn>
										</template>
										<v-card>
											<v-card-title class="text-uppercase display-2 fondoTitulo" v-text="titleDialog"></v-card-title>
											<v-card-text>
												<v-container>
													<v-row>
														<v-col cols="12" sm="12" md="12" lg="8">
															<v-text-field
																v-model="editedItem.name"
																label="Rol"
																prepend-icon="mdi-tag"
																hide-details
																color="primary"
															></v-text-field>
														</v-col>
														<v-col cols="12" sm="12" md="12" lg="4">
															<v-switch
																v-model="editedItem.status"
																hide-details
																inset
																color="primary"
																prepend-icon="mdi-check"
																:label="editedItem.status ? 'Activo' : 'Inactivo'"
															></v-switch>
														</v-col>
														<v-col cols="12" sm="12" md="12" lg="12">
															<v-textarea
																v-model="editedItem.description"
																label="Descripción"
																rows="1"
																prepend-icon="mdi-comment"
																color="primary"
																auto-grow
																hide-details
															></v-textarea>
														</v-col>
													</v-row>
												</v-container>
											</v-card-text>
											<v-card-actions>
												<v-spacer></v-spacer>
												<v-btn text color="primary" @click="closeDialogRol">Cancelar</v-btn>
												<v-btn color="secondary" @click="guardarItem">Guardar</v-btn>
											</v-card-actions>
										</v-card>
									</v-dialog>
								</v-col>
							</v-row>
						</v-toolbar>
					</template>
					<template v-slot:item.status="{ item }">
						<v-chip small dark :color="procesarStatus(item.status)" v-text="item.status ? 'ACTIVO' : 'INACTIVO'"></v-chip>
					</template>
					<template v-slot:item.actions="{ item }">
						<v-btn fab dark x-small color="blue accent-2" class="mx-1" @click="verItem(item)">
							<v-icon>mdi-eye</v-icon>
						</v-btn>
						<v-btn fab dark x-small color="primary" @click="eliminarItem(item)">
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</template>
					<template v-slot:no-data>
						<v-col cols="4" class="mx-auto">
							<v-alert type="error" dismissible border="left" colored-border color="primary" elevation="5" class="my-5">
								{{ msg_nodata }}
							</v-alert>
						</v-col>
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
			search: "",
			contador: 0,
			totalRoles: 0,
			activeRoles: 0,
			colorPage: "#D50000",
			dialogRol: false,
			page: 1,
			pageCount: 0,
			itemsPerPage: 20,
			headerTable: [
				{ text: "Cargo", value: "name", align: "center", sortable: true, groupable: false },
				{ text: "Descripción", value: "description", align: "left", sortable: false, groupable: false },
				{ text: "Estado", value: "status", align: "center", sortable: false, groupable: true },
				{ text: "Creador", value: "createdBy", align: "center", sortable: false, groupable: false },
				{ text: "Acciones", value: "actions", align: "center", sortable: false, groupable: false },
			],
			contentTable: [],
			editedIndex: -1,
			editedItem: {
				name: "",
				description: "",
				status: true,
				createdBy: "",
			},
			defaultItem: {
				name: "",
				description: "",
				status: true,
				createdBy: "",
			},
			msg_nodata: "",
		};
	},

	computed: {
		...mapState(["user"]),
		titleDialog() {
			return this.editedIndex === -1 ? "Nuevo Rol" : "Actualizar Rol";
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
	},

	watch: {
		dialogRol(val) {
			val || this.closeDialogRol();
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
			this.getCounterRolesActive();
		},

		contadorItems(pagination) {
			this.contador = pagination.itemsLength;
		},

		closeDialogRol() {
			this.dialogRol = false;
			this.$nextTick(() => {
				this.editedIndex = -1;
				this.editedItem = Object.assign({}, this.defaultItem);
			});
		},

		async getCounterRolesActive() {
			try {
				const query = await axios.get("roles/activos");
				if (query.status == 200) {
					this.activeRoles = query.data.count;
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		async cargarData() {
			try {
				const query = await axios.get("roles");
				// console.log(query);
				if (query.status == 200) {
					this.totalRoles = query.data.count;
					await query.data.all_roles.forEach((element) => {
						let obj = {};
						obj.codigo = element._id;
						obj.name = element.name;
						obj.description = element.description;
						obj.status = element.status;
						obj.createdBy = this.validarVacios(element.createdBy);

						this.contentTable.push(obj);
					});
				}
			} catch (err) {
				console.log(err.response);
				// this.msg_nodata = err.response.data.message;
				// pro.capturarError(err.response);
			}
		},

		validarVacios(element) {
			if (element == null || element == undefined || element == "") {
				return "-";
			} else {
				return element.name;
			}
		},

		procesarStatus(status) {
			if (status) return "green darken-2";
			else return "red darken-4";
		},

		verItem(item) {
			this.editedIndex = this.contentTable.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialogRol = !this.dialogRol;
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
						const query = await axios.delete("roles/" + id);
						if (query.status == 200) {
							pro.alertaExitosa(query.data.message);
							this.contentTable.splice(this.editedIndex, 1);
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

				try {
					const query = await axios.patch("roles/" + id, this.editedItem);

					if (query.status == 200) {
						pro.alertaExitosa(query.data.message);
						Object.assign(this.contentTable[this.editedIndex], this.editedItem);
						this.closeDialogRol();
					}
				} catch (err) {
					pro.capturarError(err.response);
				}
			} else {
				// console.log("Nuevo Item");
				const employee = await axios.get("users/" + this.$store.state.user.userCod);
				let newObj = {
					name: this.editedItem.name,
					description: this.editedItem.description,
					status: this.editedItem.status,
					createdBy: employee.data.founded.username,
				};
				if (newObj.name == "" || newObj.name == null) {
					pro.alertaCamposVacios("Rol");
				} else {
					try {
						const query = await axios.post("roles", newObj);
						if (query.status == 200) {
							pro.alertaExitosa(query.data.message);
							this.closeDialogRol();
							this.limpiarTabla();
							await this.cargarData();
							await this.getCounterRolesActive();
						}
					} catch (err) {
						pro.capturarError(err.response);
					}
				}
			}
		},

		limpiarTabla() {
			let size = this.contentTable.length;
			this.contentTable.splice(this.contentTable, size);
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
