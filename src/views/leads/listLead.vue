<template>
     <div class="mx-5 my-5">
          <v-row>
               <v-col cols="12" sm="12" md="12" lg="12">
                    <v-data-table
                         :headers="headerTable"
                         :items="contentTable"
                         :search="search"
                         sort-by="fecha_ingreso"
                         sort-desc
                         class="elevation-1"
                         show-group-by  
                         :loading="contentTable.length > 0 ? false : true"
                         loading-text="Cargando Datos"
                         hide-default-footer
                         :items-per-page.sync="itemsPerPage"
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
                         <template v-slot:item.estado_lead="{ item }">
                              <v-chip small dark :color="pintarStatus(item.estado_lead)" v-text="item.estado_lead"></v-chip>
                         </template>
                         <template v-slot:item.dataOrigin="{ item }">
                              <v-chip x-small dark :color="colorOrigenData(item.dataOrigin)">
                                  <v-icon v-text="iconOrigenData(item.dataOrigin)" x-small left></v-icon>
                                  {{item.dataOrigin}}
                                </v-chip>
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
                                        <span class="font-weight-bold text-h5 mr-10 primary--text">{{ items.length }}</span>
                                   </v-row>
                              </th>
                         </template>
                         <template v-slot:item.actions="{ item }">
                              <v-tooltip left color="accent">
                                   <template v-slot:activator="{ attrs, on }">
                                        <v-btn icon color="accent" class="mx-1" v-bind="attrs" v-on="on" @click="verItem(item)">
                                             <v-icon large>mdi-eye</v-icon>
                                        </v-btn>
                                   </template>
                                   <span>Visualizar lead</span>
                              </v-tooltip>
                              <v-btn icon color="primary" @click="eliminarItem(item)">
                                   <v-icon large>mdi-delete</v-icon>
                              </v-btn>
                         </template>
                    </v-data-table>
                    <div class="text-center pt-2">
                         <v-pagination v-model="page" :length="pageCount" :total-visible="9"></v-pagination>
                    </div>
               </v-col>
          </v-row>
     </div>
</template>
<script>
import * as pro from "../../plugins/helper";
import Swal from "sweetalert2";
import { mapActions, mapState } from "vuex";

export default {
     data() {
          return {
               itemSeleccionado: [],
               totalLeads: 0,
               search: "",
               contador: 0,
               page: 1,
               pageCount: 0,
               itemsPerPage: 100,
               dialogLead: false,
               headerTable: [
                    { text: "Fecha", value: "fecha_ingreso", align: "center", sortable: false, groupable: false, class: "text-uppercase text-h7" },
                    { text: "Origen", value: "dataOrigin", align: "center", sortable: false, groupable: true, class: "text-uppercase text-h7" },
                    { text: "Marca", value: "marcaVehiculoE", align: "center", sortable: false, groupable: true, class: "text-uppercase text-h7" },
                    { text: "Cliente", value: "customer_name", align: "left", sortable: false, groupable: false, class: "text-uppercase text-h7" },
                    { text: "DNI", value: "customer_document", align: "center", sortable: false, groupable: false, class: "text-uppercase text-h7" },
                    { text: "Celular", value: "customer_cellphone", align: "center", sortable: false, groupable: false, class: "text-uppercase text-h7" },
                    { text: "Estado", value: "estado_lead", align: "center", sortable: false, groupable: true, class: "text-uppercase text-h7" },
                    { text: "Acciones", value: "actions", align: "center", sortable: false, groupable: false, class: "text-uppercase text-h7" },
               ],
               contentTable: [],
               userLogged:{
                name: '',
                username: '',
                marca: []
            }
          };
     },

     computed:{
          ...mapState(["user"]),

          userOnline() {
            if (pro.validarVacios(this.user)) {
                let usuario = {
                    token: localStorage.getItem("data-token"),
                    userId: localStorage.getItem("data-user"),
                };
                return usuario;
            } else {
                return this.user;
            }
        },
     },

     async created(){
          this.detectarUsuario(this.userOnline);
          await this.getUserConnected();
          this.inicializar();
     },

     methods: {
          ...mapActions(["detectarUsuario"]),

          async getUserConnected(){
            try {
                const query = await axios.get('users/' + this.userOnline.userCod);
                if(pro.askHttp200(query.status)){
                    this.userLogged.name = query.data.founded.name;
                    this.userLogged.username = query.data.founded.username;
                    this.userLogged.marca = query.data.founded.marca.map(a => a.name);
                }
            } catch (err) {
                pro.capturarError(err.response);
            }
        },

          inicializar() {
               this.cargarData();
          },

          contadorItems(pagination) {
               this.contador = pagination.itemsLength;
          },

          pintarStatus(item) {
               return pro.colorearEstadoLead(item);
          },

          colorOrigenData(item) {
               return pro.colorOrigenData(item);
          },

          iconOrigenData(item) {
               return pro.iconOrigenData(item);
          },

          async cargarData() {
               let obj = {
                    marca: this.userLogged.marca,
                    start: null
               }

               try {
                    const query = await axios.post("leads/by-marca",obj);

                    if (pro.askHttp200(query.status)) {
                         this.totalLeads = query.data.total;
                         await query.data.all.forEach((element) => {
                              let obj = {};

                              obj.codigo = element._id;
                              obj.fecha_ingreso = pro.formatearFecha(element.fecha_ingreso);
                              obj.dataOrigin = pro.validarVacios(element.dataOrigin) ? "" : element.dataOrigin.name;
                              obj.marcaVehiculoE = pro.validarVacios(element.marcaVehiculoE) ? "" : element.marcaVehiculoE.name;
                              obj.customer_name = element.customer_name;
                              obj.customer_document = element.customer_document;
                              obj.customer_city = element.customer_city;
                              obj.customer_cellphone = element.customer_cellphone;
                              obj.customer_cellphone2 = element.customer_cellphone2;
                              obj.customer_email = element.customer_email;
                              obj.estado_lead = element.estado_lead;

                              this.contentTable.push(obj);
                         });
                    }
               } catch (err) {
                    console.log(err);
                    console.log(err.response);
                    // pro.capturarError(err.response);
               }
          },

          verItem(item) {
               let id = item.codigo;
               this.$router.push({ name: "Ver Lead", params: { leadId: id } });
          },

          eliminarItem(item) {
               // if(this.itemSeleccionado.length >= 2){
               //     console.log('Varios Documentos');

               // }else{
               //     console.log('1 documentos');

               // }
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
     },
};
</script>
