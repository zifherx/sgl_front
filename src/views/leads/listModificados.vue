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
                                                       hide-details
                                                       readonly
                                                       v-bind="attrs"
                                                       v-on="on"
                                                  ></v-text-field>
                                             </template>
                                             <v-date-picker v-model="rangoFechas" locale="es" scrollable range color="primary" header-color="primary">
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
                         show-group-by
                         group-by="marcaVehiculoE"
                         sort-by="name"
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
                                        <v-spacer v-if="$vuetify.breakpoint.xs ? false : true"></v-spacer>
                                        <v-col :cols="$vuetify.breakpoint.xs ? '9' : '6'">
                                             <v-text-field
                                                  v-model="search"
                                                  label="Buscar..."
                                                  prepend-inner-icon="mdi-magnify"
                                                  hide-details
                                                  outlined
                                                  placeholder="Ingrese filtro de búsqueda"
                                                  color="primary"
                                             ></v-text-field>
                                        </v-col>
                                        <v-col :cols="$vuetify.breakpoint.xs ? '1' : '1'">
                                             <v-tooltip bottom color="primary">
                                                  <template v-slot:activator="{ attrs, on }">
                                                       <v-btn fab dark color="primary" class="mx-1" v-bind="attrs" v-on="on">
                                                            <v-icon>mdi-export</v-icon>
                                                       </v-btn>
                                                  </template>
                                                  <span>Exportar</span>
                                             </v-tooltip>
                                        </v-col>
                                   </v-row>
                              </v-toolbar>
                         </template>
                         <template v-slot:group.header="{ group, headers, isOpen, toggle, remove, items }">
                              <th :colspan="headers.length">
                                   <v-row>
                                        <v-btn @click="toggle" small icon :ref="group" :data-open="isOpen">
                                             <v-icon v-if="isOpen" color="primary">mdi-chevron-up</v-icon>
                                             <v-icon v-else color="primary">mdi-chevron-down</v-icon>
                                        </v-btn>
                                        <span class="text-uppercase text-h5 font-weight-bold mx-3 primary--text">{{ group }}</span>
                                        <v-btn @click="remove" small icon>
                                             <v-icon color="primary">mdi-close-circle</v-icon>
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        <span class="font-weight-bold text-h5 mr-10">{{ items.length }}</span>
                                   </v-row>
                              </th>
                         </template>
                         <template v-slot:item.dataOrigin="{ item }">
                              <v-chip x-small dark :color="colorOrigenData(item.dataOrigin)">
                                   <v-icon v-text="iconOrigenData(item.dataOrigin)" x-small left></v-icon>
                                   {{ item.dataOrigin }}
                              </v-chip>
                         </template>
                         <template v-slot:item.estado_lead="{ item }">
                              <v-chip x-small dark :color="pintarStatus(item.estado_lead)" v-text="item.estado_lead"></v-chip>
                         </template>
                         <template v-slot:item.sucursal="{ item }">
                              <v-chip x-small dark :color="colorearSucursal(item.sucursal)" v-text="item.sucursal"></v-chip>
                         </template>
                         <template v-slot:item.actions="{ item }">
                              <v-btn icon small color="accent" @click="verItem(item)">
                                   <v-icon>mdi-eye</v-icon>
                              </v-btn>
                              <v-btn icon small color="primary" @click="eliminarItem(item)">
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
import * as pro from "../../plugins/helper";
import Swal from "sweetalert2";

export default {
     data() {
          return {
               totalLeads: 0,
               search: "",
               contador: 0,
               page: 1,
               pageCount: 0,
               itemsPerPage: 50,
               dialogLead: false,
               headerTable: [
                    { text: "Sucursal", value: "sucursal", align: "center", sortable: false, groupable: true, class: "text-uppercase text-h7" },
                    { text: "Fecha", value: "fecha_ingreso", align: "center", sortable: false, groupable: false, class: "text-uppercase text-h7" },
                    // { text: "Origen", value: "dataOrigin", align: "center", sortable: false, groupable: true, class: "text-uppercase text-h7" },
                    { text: "Marca", value: "marcaVehiculoE", align: "center", sortable: false, groupable: true, class: "text-uppercase text-h7" },
                    { text: "Cliente", value: "customer_name", align: "center", sortable: true, groupable: false, class: "text-uppercase text-h7" },
                    { text: "DNI", value: "customer_document", align: "center", sortable: false, groupable: false, class: "text-uppercase text-h7" },
                    { text: "Celular", value: "customer_cellphone", align: "center", sortable: false, groupable: false, class: "text-uppercase text-h7" },
                    { text: "Estado", value: "estado_lead", align: "center", sortable: false, groupable: true, class: "text-uppercase text-h7" },
                    { text: "Creado", value: "createdAt", align: "center", sortable: false, groupable: false, class: "text-uppercase text-h7" },
                    { text: "Modificación", value: "updatedAt", align: "center", sortable: false, groupable: false, class: "text-uppercase text-h7" },
                    { text: "Acciones", value: "actions", align: "center", sortable: false, groupable: false, class: "text-uppercase text-h7" },
               ],
               contentTable: [],
               //API FECHAS
               modal1: false,
               rangoFechas: [],
          };
     },

     computed: {
          fechaTexto() {
               return this.rangoFechas.join(" - ");
          },
     },

     created() {
          this.inicializar();
     },

     methods: {
          inicializar() {
               this.initCombox();
          },

          initCombox() {
               // this.getSucursalesActivas();
          },

          contadorItems(pagination) {
               this.contador = pagination.itemsLength;
          },

          pintarStatus(item) {
               return pro.colorearEstadoLead(item);
          },

          async cargarData() {
               let obj = {};
               obj.start = this.rangoFechas[0];
               obj.end = this.rangoFechas[1];

               try {
                    const query = await axios.post("leads/by-modificado", obj);
                    // console.log(query);
                    if (pro.askHttp200(query.status)) {
                         this.totalLeads = query.data.total;
                         await query.data.all.forEach((element) => {
                              let obj = {};

                              obj.codigo = element._id;
                              obj.fecha_ingreso = pro.formatearFecha(element.fecha_ingreso);
                              obj.sucursal = pro.validarVacios(element.sucursal_lead) ? "" : element.sucursal_lead.name;
                              obj.dataOrigin = pro.validarVacios(element.dataOrigin) ? "" : element.dataOrigin.name;
                              obj.marcaVehiculoE = pro.validarVacios(element.marcaVehiculoE) ? "" : element.marcaVehiculoE.name;
                              obj.customer_name = element.customer_name;
                              obj.customer_document = element.customer_document;
                              obj.customer_city = element.customer_city;
                              obj.customer_cellphone = element.customer_cellphone;
                              obj.customer_cellphone2 = element.customer_cellphone2;
                              obj.customer_email = element.customer_email;
                              obj.estado_lead = pro.validarVacios(element.estado_lead) ? "" : element.estado_lead;
                              obj.createdAt = pro.validarVacios(element.createdAt) ? "" : pro.formatearFecha(element.createdAt, true);
                              obj.updatedAt = pro.validarVacios(element.updatedAt) ? "" : pro.formatearFecha(element.updatedAt, true);

                              this.contentTable.push(obj);
                         });
                    }
               } catch (err) {
                    pro.capturarError(err.response);
               }
          },

          verItem(item) {
               let id = item.codigo;
               this.$router.push({ name: "Ver Lead", params: { leadId: id } });
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
                              const query = await axios.delete("leads/" + id);
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

          cargarFiltro() {
               if (this.contentTable.length > 0) {
                    pro.limpiarTabla(this.contentTable);
                    this.cargarData();
               } else {
                    this.cargarData();
               }
          },

          colorOrigenData(item) {
               return pro.colorOrigenData(item);
          },

          iconOrigenData(item) {
               return pro.iconOrigenData(item);
          },

          colorearSucursal(item){
               return pro.colorearSucursal(item);
          }
     },
};
</script>
