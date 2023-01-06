<template>
	<div class="mx-5 my-5">
		<v-row>
			<v-col cols="12" sm="12" md="12" lg="8">
				<base-material-card title="FILTROS" color="primary" icon="mdi-filter" class="px-5 py-3">
					<div class="m-1 my-2">
						<v-row>
							<v-col cols="12" sm="12" md="7" lg="5">
								<v-dialog ref="dialog1" v-model="modal1" :return-value.sync="rangoFechas" persistent width="290px">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field
											class="centered-input text--darken-3"
											v-model="fechaTexto"
											label="Selecciona Fechas"
											prepend-inner-icon="mdi-calendar"
											color="primary"
											dense
											outlined
											rounded
											hide-details
											readonly
											v-bind="attrs"
											v-on="on"
										></v-text-field>
									</template>
									<v-date-picker v-model="rangoFechas" locale="es" range scrollable color="primary" header-color="primary">
										<v-spacer></v-spacer>
										<v-btn text color="primary" @click="modal1 = false"> Cancelar </v-btn>
										<v-btn dark color="secondary" @click="$refs.dialog1.save(rangoFechas)"> OK </v-btn>
									</v-date-picker>
								</v-dialog>
							</v-col>
							<v-col cols="12" sm="12" md="12" lg="3">
								<v-btn rounded block dark color="primary" @click="cargarFiltro">
									<v-icon>mdi-filter-check</v-icon>
								</v-btn>
							</v-col>
						</v-row>
					</div>
				</base-material-card>
			</v-col>
			<v-col cols="12" sm="12" md="12" lg="4">
				<base-material-stats-card v-model="totalLeads" color="primary" icon="mdi-swap-horizontal" value="0" title="TOTAL"></base-material-stats-card>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" sm="12" md="12" lg="12">
				<v-data-table
                    :headers="headerTable"
                    :items="contentTable"
                    :search="search"
                    group-by="sucursal"
                    show-group-by
                    class="elevation-1"
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
                                <v-col :cols="$vuetify.breakpoint.xs ? '2' : '1'" class="text-center">
									<v-avatar size="48" color="primary" class="white--text" v-text="contador"></v-avatar>
								</v-col>
								<v-col :cols="$vuetify.breakpoint.xs ? '9' : '4'">
									<v-toolbar-title class="display-2 text-uppercase">Leads</v-toolbar-title>
								</v-col>
                                <v-col :cols="$vuetify.breakpoint.xs ? '12' : '7'">
									<v-text-field
										v-model="search"
										label="Buscar..."
										prepend-inner-icon="mdi-magnify"
										hide-details
										outlined
										rounded
										placeholder="Ingrese filtro de búsqueda"
										color="primary"
									></v-text-field>
								</v-col>
								<v-dialog v-model="dialogConversion" persistent max-width="800" transition="dialog-bottom-transition">
									<v-card elevation="10">
										<v-card-title class="fondoTitulo text-uppercase">Conversión a Venta</v-card-title>
										<v-card-text>
											<div class="mx-5 my-5">
												<v-row>
													<v-col cols="12" sm="12" md="12" lg="4">
														<v-text-field
															class="centered-input text--darken-1"
															v-model="editedItem.fecha_ingreso"
															label="Registro"
															prepend-inner-icon="mdi-calendar"
															hide-details
															dense
															color="primary"
															outlined
															disabled
														></v-text-field>
													</v-col>
													<v-col cols="12" sm="12" md="12" lg="4">
														<v-text-field
															class="centered-input text--darken-1"
															v-model="editedItem.fecha_conversion"
															label="Conversión"
															prepend-inner-icon="mdi-calendar"
															hide-details
															dense
															color="primary"
															outlined
															disabled
														></v-text-field>
													</v-col>
													<v-col cols="12" sm="12" md="12" lg="4">
														<v-select
															v-model="conversionSeleccionado"
															:items="listaConversiones"
															item-text="name"
															item-value="name"
															outlined
															label="Estado"
															prepend-inner-icon="mdi-swap-horizontal"
															hide-details
															dense
															color="primary"
															:menu-props="{bottom: true, offsetY: true}"
														>
															<template v-slot:selection="data">
																<v-chip small dark :color="pintarEstado(data.item.name)" v-text="data.item.name"></v-chip>
															</template>
															<template v-slot:item="data">
																<v-list-item-avatar>
																	<v-avatar class="white--text" :color="pintarEstado(data.item.name)" size="48">
																		{{data.item.value}}
																	</v-avatar>
																</v-list-item-avatar>
																<v-list-item-content>
																	<v-list-item-title v-html="data.item.name"></v-list-item-title>
																</v-list-item-content>
															</template>
														</v-select>
													</v-col>
													<v-col cols="12" sm="12" md="12" lg="12">
														<v-divider class="mb-2"></v-divider>
													</v-col>
													<v-col cols="12" sm="12" md="12" lg="8">
														<v-text-field
															class="centered-input text--darken-1"
															v-model="editedItem.customer_name"
															label="Cliente"
															prepend-inner-icon="mdi-account-circle"
															hide-details
															dense
															color="primary"
															outlined
															disabled
														></v-text-field>
													</v-col>
													<v-col cols="12" sm="12" md="12" lg="4">
														<v-text-field
															class="centered-input text--darken-1"
															v-model="editedItem.customer_document"
															label="DNI"
															prepend-inner-icon="mdi-tag"
															hide-details
															dense
															color="primary"
															outlined
															disabled
														></v-text-field>
													</v-col>
													<v-col cols="12" sm="12" md="12" lg="4">
														<v-text-field
															class="centered-input text--darken-1"
															v-model="editedItem.customer_cellphone"
															label="Celular"
															prepend-inner-icon="mdi-phone"
															hide-details
															dense
															color="primary"
															outlined
															disabled
														></v-text-field>
													</v-col>
													<v-col cols="12" sm="12" md="12" lg="8">
														<v-text-field
															class="centered-input text--darken-1"
															v-model="editedItem.customer_email"
															label="Email"
															prepend-inner-icon="mdi-at"
															hide-details
															dense
															color="primary"
															outlined
															disabled
														></v-text-field>
													</v-col>
													<v-col cols="12" sm="12" md="12" lg="12">
														<v-divider class="mb-2"></v-divider>
													</v-col>
													<v-col cols="12" sm="12" md="12" lg="4">
														<v-text-field
															class="centered-input text--darken-1"
															v-model="editedItem.sucursal_lead"
															label="Sucursal"
															prepend-inner-icon="mdi-map-marker"
															hide-details
															dense
															color="primary"
															outlined
															disabled
														></v-text-field>
													</v-col>
													<v-col cols="12" sm="12" md="12" lg="8">
														<v-text-field
															class="centered-input text--darken-1"
															v-model="editedItem.asesorAsignado"
															label="Asesor de Venta"
															prepend-inner-icon="mdi-account-box"
															hide-details
															dense
															color="primary"
															outlined
															disabled
														></v-text-field>
													</v-col>
													<v-col cols="12" sm="12" md="12" lg="4">
														<v-text-field
															class="centered-input text--darken-1"
															v-model="editedItem.auto"
															label="Vehículo"
															prepend-inner-icon="mdi-car"
															hide-details
															dense
															color="primary"
															outlined
															disabled
														></v-text-field>
													</v-col>
													<v-col cols="12" sm="12" md="12" lg="8">
														<v-text-field
															class="centered-input text--darken-1"
															v-model="editedItem.vehicleVersion"
															label="Versión"
															prepend-inner-icon="mdi-car"
															hide-details
															dense
															color="primary"
															outlined
															disabled
														></v-text-field>
													</v-col>
												</v-row>
											</div>
										</v-card-text>
										<v-card-actions>
											<v-spacer></v-spacer>
											<v-btn text color="primary" @click="closeDialogConversion">Cancelar</v-btn>
											<v-btn dark color="green darken-2" @click="updateStatusConversion">Guardar</v-btn>
										</v-card-actions>
									</v-card>
								</v-dialog>
                            </v-row>
                        </v-toolbar>
                    </template>
					<template v-slot:item.estado_conversion="{item}">
						<v-chip :color="pintarEstado(item.estado_conversion)" small v-text="item.estado_conversion" dark></v-chip>
					</template>
                    <template v-slot:item.actions="{item}">
                        <v-btn fab x-small dark color="deep-orange darken-1" class="mx-1" @click="abrirDialogConversion(item)">
                            <v-icon>mdi-update</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
                <div class="text-center pt-2">
					<v-pagination v-model="page" :length="pageCount" :total-visible="10" circle></v-pagination>
				</div>
			</v-col>
		</v-row>
	</div>
</template>
<script>
import * as pro from "../../../plugins/helper";
import Swal from "sweetalert2";

export default {
	data() {
		return {
			totalLeads: 0,
			search: "",
			modal1: false,
			rangoFechas: [
				new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().substr(0, 10),
				new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().substr(0, 10),
			],
			contador: 0,
			page: 1,
			pageCount: 0,
			itemsPerPage: 20,
			headerTable: [
                { text: 'Sucursal', value: 'sucursal', align: 'center', sortable: false, groupable: true, class: "text-uppercase text-h5"},
                { text: 'Registro', value: 'fecha_ingreso', align: 'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                { text: 'Conversión', value: 'fecha_conversion', align: 'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                { text: 'Cliente', value: 'customer_name', align: 'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                { text: 'Asesor', value: 'asesorAsignado', align: 'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                { text: 'Vehículo', value: 'auto', align: 'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                { text: 'Estado', value: 'estado_conversion', align: 'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                { text: 'Acciones', value: 'actions', align: 'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
            ],
			contentTable: [],
			//Dialog Conversion
			dialogConversion: false,
			editedItem: {},
			defaultItem: {},
			editedIndex: -1,
			//API ESTADO CONVERSION
			conversionSeleccionado: '',
			listaConversiones: [],
		};
	},

	computed: {
		fechaTexto() {
			return this.rangoFechas.join(" - ");
		},
	},

	created() {
		this.cargarFiltro();
		this.initCombos();
	},

	methods: {
		contadorItems(pagination) {
			this.contador = pagination.itemsLength;
		},

		initCombos(){
			this.getAllActiveEstadosConversion();
		},

		reiniciarTablero(){
			pro.limpiarTabla(this.contentTable);
			this.cargarData();
		},

		async getAllActiveEstadosConversion(){
			try {
				const query = await axios.get('shift/activos');
				if(query.status == 200){
					this.listaConversiones = query.data.active_status;
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		cargarFiltro() {
			if (this.contentTable.length > 0) {
				this.reiniciarTablero();
			} else {
				this.cargarData();
			}
		},

		async cargarData() {
            let param = {};
            param.estado_lead = 'CONVERTIDO';
            param.start = this.rangoFechas[0];
            param.end = this.rangoFechas[1];

            try {
                const query = await axios.post('leads/by-status', param);
                // console.log(query);

                if(query.status == 200){
                    this.totalLeads = query.data.total;
                    await query.data.leads.forEach((element) => {
                        let obj = {};

						obj.codigo = element._id
                        obj.sucursal = pro.validarVacios(element.sucursal_lead) ? '' : element.sucursal_lead.name;
                        obj.fecha_ingreso = pro.formatearFecha(element.fecha_ingreso);
                        obj.fecha_conversion = pro.formatearFecha(element.fecha_conversion);
                        obj.customer_name = element.customer_name;
                        obj.customer_document = element.customer_document;
                        obj.customer_cellphone = element.customer_cellphone;
                        obj.customer_email = element.customer_email;
                        obj.sucursal_lead = pro.validarVacios(element.sucursal_lead) ? '' : element.sucursal_lead.name;
                        obj.asesorAsignado = pro.validarVacios(element.asesorAsignado) ? '' : element.asesorAsignado.name;
                        obj.auto = pro.validarVacios(element.auto) ? '' : element.auto.model.name;
                        obj.vehicleVersion = pro.validarVacios(element.auto) ? '' : element.auto.version;
                        obj.estado_conversion = pro.validarVacios(element.estado_conversion) ? '' : element.estado_conversion.name;

                        this.contentTable.push(obj);
                    });
                }
            } catch (err) {
                pro.capturarError(err.response);
            }
        },

		pintarEstado(item){
			return pro.colorearEstadoConversion(item);
		},

		abrirDialogConversion(item){
			// console.log(item);
			this.editedIndex = this.contentTable.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.conversionSeleccionado = this.editedItem.estado_conversion;
			this.dialogConversion = !this.dialogConversion;
		},

		closeDialogConversion(){
			this.dialogConversion = false;
			this.$nextTick(() => {
				this.editedIndex = -1;
				this.editedItem = Object.assign({}, this.defaultItem);
			});
		},

		async updateStatusConversion(){
			let codigo = this.editedItem.codigo;

			let query = null;

			let newObj = {
				estado_conversion: this.conversionSeleccionado,
				//Booking
				isBooking: true,
				fecha_booking: pro.formatearFecha(new Date(), true),
				//Down
				isDown: true,
				fecha_down: pro.formatearFecha(new Date(), true),
				//Venta
				isVenta: true,
				fecha_venta: pro.formatearFecha(new Date(), true)
			};

			try {
				if(this.conversionSeleccionado == 'BOOKING'){
					query = await axios.patch('leads/update/booked/' + codigo, newObj);
					if(query.status == 200){
						pro.alertaExitosa(query.data.message);
					}
				}else if(this.conversionSeleccionado == 'DOWN'){
					query = await axios.patch('leads/update/downed/' + codigo, newObj);
					if(query.status == 200){
						pro.alertaExitosa(query.data.message);
					}
				}else if(this.conversionSeleccionado == 'VENTA'){
					query = await axios.patch('leads/update/saled/' + codigo, newObj);
					if(query.status == 200){
						pro.alertaExitosa(query.data.message);
					}
				}
				this.reiniciarTablero();
				this.closeDialogConversion();
			} catch (err) {
				pro.capturarError(err.response);
			}

		}
	},
};
</script>
<style scoped>
.centered-input >>> input {
	text-align: center;
	font-size: 16px;
}

.fondoTitulo{
	background-color: #D50000;
	color: white;
	font-size: 16px;
}
</style>