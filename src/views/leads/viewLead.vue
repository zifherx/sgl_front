<template>
     <div class="mx-5 my-5">
          <v-row>
               <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card elevation="10">
                         <v-card-title class="fondoTitulo text-uppercase display-1">
                              {{ titlePage }}
                              <v-spacer></v-spacer>
                              <v-tooltip bottom color="black">
                                   <template v-slot:activator="{ attrs, on }">
                                        <v-btn fab dark color="black" v-bind="attrs" v-on="on" @click="habilitadEdicion">
                                             <v-icon color="primary" large>mdi-pencil</v-icon>
                                        </v-btn>
                                   </template>
                                   <span>Habilitar Edición</span>
                              </v-tooltip>
                         </v-card-title>
                         <v-card-text>
                              <div class="mx-5 my-5">
                                   <v-row>
                                        <v-col cols="12" sm="8" md="8" lg="8">
                                             <v-row>
                                                  <v-col cols="12" sm="12" md="12" lg="12">
                                                       <v-row>
                                                            <v-card-subtitle class="text-uppercase primary--text">Detalle</v-card-subtitle>
                                                            <v-card-text>
                                                                 <v-row>
                                                                      <v-col cols="12" sm="12" md="12" lg="3" v-show="false">
                                                                           <v-text-field
                                                                                class="centered-input text--darken-1"
                                                                                v-model="editedItem.fecha_ingreso"
                                                                                label="Fecha de Registro"
                                                                                prepend-inner-icon="mdi-calendar"
                                                                                hide-details
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                color="primary"
                                                                                readonly
                                                                           ></v-text-field>
                                                                      </v-col>
                                                                      <v-col cols="12" sm="12" md="12" lg="8">
                                                                           <v-text-field
                                                                                class="centered-input text--darken-1"
                                                                                v-model="editedItem.dataOrigin"
                                                                                label="Origen de Cliente"
                                                                                :prepend-inner-icon="editedItem.dataOrigin == 'WHATSAPP' ? 'mdi-whatsapp' : 'mdi-facebook'"
                                                                                hide-details
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                color="primary"
                                                                                readonly
                                                                           ></v-text-field>
                                                                      </v-col>
                                                                      <v-col cols="12" sm="12" md="12" lg="4">
                                                                           <v-select
                                                                                v-model="estadoSeleccionado"
                                                                                :items="listaEstados"
                                                                                label="Estado"
                                                                                item-value="name"
                                                                                item-text="name"
                                                                                prepend-inner-icon="mdi-tag"
                                                                                hide-details
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                :disabled="isEnable"
                                                                                color="primary"
                                                                                :menu-props="{ bottom: true, offsetY: true }"
                                                                           >
                                                                                <template v-slot:selection="data">
                                                                                     <v-chip small dark :color="colorStatus(data.item.name)" v-text="data.item.name"></v-chip>
                                                                                </template>
                                                                                <template v-slot:item="data">
                                                                                     <v-list-item-avatar size="40" class="white--text" :color="colorStatus(data.item.name)">
                                                                                          {{ data.item.value }}%
                                                                                     </v-list-item-avatar>
                                                                                     <v-list-item-content>
                                                                                          <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                                                                     </v-list-item-content>
                                                                                </template>
                                                                           </v-select>
                                                                      </v-col>
                                                                      <v-col v-if="estadoSeleccionado == 'NO INTERESADO'" cols="12" sm="12" md="12" lg="12">
                                                                           <v-select
                                                                                v-model="motivosRechazoSeleccionado"
                                                                                :items="listaMotivosRechazo"
                                                                                label="Motivos de Rechazo"
                                                                                item-text="name"
                                                                                item-value="name"
                                                                                :menu-props="{ bottom: true, offsetY: true }"
                                                                                dense
                                                                                hide-details
                                                                                outlined
                                                                                rounded
                                                                                color="primary"
                                                                                :disabled="isEnable"
                                                                           >
                                                                                <template v-slot:selection="data">
                                                                                     <v-chip color="primary" small dark v-text="data.item.name"></v-chip>
                                                                                </template>
                                                                                <template v-slot:item="data">
                                                                                     <v-list-item-avatar color="primary">
                                                                                          <v-icon color="white" v-text="setIconMotivos(data.item.name)"></v-icon>
                                                                                     </v-list-item-avatar>
                                                                                     <v-list-item-content>
                                                                                          <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                                                                     </v-list-item-content>
                                                                                </template>
                                                                           </v-select>
                                                                      </v-col>
                                                                      <v-col v-if="estadoSeleccionado == 'NO INTERESADO'" cols="12" sm="12" md="12" lg="12">
                                                                           <v-textarea
                                                                                v-model="editedItem.motivo_rechazo"
                                                                                label="Otros"
                                                                                auto-grow
                                                                                rows="1"
                                                                                hide-details
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                :disabled="isEnable"
                                                                                color="primary"
                                                                           ></v-textarea>
                                                                      </v-col>
                                                                      <v-col v-if="estadoSeleccionado == 'DECLINADO'" cols="12" sm="12" md="12" lg="12">
                                                                           <v-textarea
                                                                                v-model="editedItem.motivo_desistencia"
                                                                                label="Motivo de Desistencia"
                                                                                auto-grow
                                                                                rows="1"
                                                                                hide-details
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                :disabled="isEnable"
                                                                                color="primary"
                                                                           ></v-textarea>
                                                                      </v-col>
                                                                      <v-col cols="12" sm="12" md="12" lg="12">
                                                                           <v-textarea
                                                                                v-model="editedItem.comentario"
                                                                                label="Comentario"
                                                                                auto-grow
                                                                                rows="1"
                                                                                hide-details
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                :disabled="isEnable"
                                                                                color="primary"
                                                                           ></v-textarea>
                                                                      </v-col>
                                                                      <v-col cols="12" sm="12" md="12" lg="12">
                                                                           <v-textarea
                                                                                v-model="editedItem.observacion"
                                                                                label="Observación"
                                                                                auto-grow
                                                                                rows="1"
                                                                                hide-details
                                                                                outlined
                                                                                rounded
                                                                                dense
                                                                                :disabled="isEnable"
                                                                                color="primary"
                                                                           ></v-textarea>
                                                                      </v-col>
                                                                 </v-row>
                                                            </v-card-text>
                                                            <v-card-subtitle class="text-uppercase primary--text">Cliente</v-card-subtitle>
                                                            <v-card-text>
                                                                 <v-row>
                                                                      <v-col cols="12" sm="12" md="12" lg="8">
                                                                           <v-text-field
                                                                                class="centered-input text--darken-1"
                                                                                v-model="editedItem.customer_name"
                                                                                label="Cliente"
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                hide-details
                                                                                readonly
                                                                                prepend-inner-icon="mdi-account-circle"
                                                                                color="primary"
                                                                           ></v-text-field>
                                                                      </v-col>
                                                                      <v-col cols="12" sm="12" md="12" lg="4">
                                                                           <v-text-field
                                                                                class="centered-input text--darken-1"
                                                                                v-model="editedItem.customer_document"
                                                                                label="DNI"
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                hide-details
                                                                                readonly
                                                                                prepend-inner-icon="mdi-tag"
                                                                                color="primary"
                                                                           ></v-text-field>
                                                                      </v-col>
                                                                      <v-col cols="12" sm="12" md="12" lg="4">
                                                                           <v-text-field
                                                                                class="centered-input text--darken-1"
                                                                                v-model="editedItem.customer_cellphone"
                                                                                label="Celular 01"
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                hide-details
                                                                                readonly
                                                                                prepend-inner-icon="mdi-phone"
                                                                                color="primary"
                                                                           ></v-text-field>
                                                                      </v-col>
                                                                      <v-col cols="12" sm="12" md="12" lg="4">
                                                                           <v-text-field
                                                                                class="centered-input text--darken-1"
                                                                                v-model="editedItem.customer_cellphone2"
                                                                                label="Celular 02"
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                hide-details
                                                                                readonly
                                                                                prepend-inner-icon="mdi-phone"
                                                                                color="primary"
                                                                           ></v-text-field>
                                                                      </v-col>
                                                                      <v-col cols="12" sm="12" md="12" lg="4">
                                                                           <v-text-field
                                                                                class="centered-input text--darken-1"
                                                                                v-model="editedItem.customer_city"
                                                                                label="Ciudad"
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                hide-details
                                                                                readonly
                                                                                prepend-inner-icon="mdi-map-marker"
                                                                                color="primary"
                                                                           ></v-text-field>
                                                                      </v-col>
                                                                      <v-col cols="12" sm="12" md="12" lg="12">
                                                                           <v-text-field
                                                                                class="centered-input text--darken-1"
                                                                                v-model="editedItem.customer_email"
                                                                                label="Email"
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                hide-details
                                                                                readonly
                                                                                prepend-inner-icon="mdi-at"
                                                                                color="primary"
                                                                           ></v-text-field>
                                                                      </v-col>
                                                                 </v-row>
                                                            </v-card-text>
                                                            <v-card-subtitle class="text-uppercase primary--text">Vehículo</v-card-subtitle>
                                                            <v-card-text>
                                                                 <v-row>
                                                                      <v-col cols="12" sm="12" md="6" lg="6">
                                                                           <v-select
                                                                                v-model="marcaSeleccionada"
                                                                                :items="listaMarcas"
                                                                                prepend-inner-icon="mdi-tag"
                                                                                label="Marca"
                                                                                item-text="name"
                                                                                hide-details
                                                                                outlined
                                                                                rounded
                                                                                dense
                                                                                :disabled="isEnable"
                                                                                color="primary"
                                                                                :menu-props="{ bottom: true, offsetY: true }"
                                                                                v-on:change="getAllModelos(marcaSeleccionada)"
                                                                           >
                                                                                <template v-slot:selection="data">
                                                                                     <v-chip small color="primary" dark v-text="data.item.name"></v-chip>
                                                                                </template>
                                                                                <template v-slot:item="data">
                                                                                     <v-list-item-avatar size="30">
                                                                                          <v-img :src="data.item.avatar" contain></v-img>
                                                                                     </v-list-item-avatar>
                                                                                     <v-list-item-content>
                                                                                          <v-list-item-title v-html="data.item.name"> </v-list-item-title>
                                                                                     </v-list-item-content>
                                                                                </template>
                                                                           </v-select>
                                                                      </v-col>
                                                                      <v-col cols="12" sm="12" md="6" lg="6">
                                                                           <v-autocomplete
                                                                                v-model="modeloSeleccionado"
                                                                                :items="listaModelos"
                                                                                item-text="name"
                                                                                label="Modelo"
                                                                                prepend-inner-icon="mdi-car"
                                                                                :menu-props="{ bottom: true, offsetY: true }"
                                                                                hide-details
                                                                                outlined
                                                                                rounded
                                                                                dense
                                                                                :disabled="isEnable"
                                                                                color="primary"
                                                                                v-on:change="getAllVersiones(modeloSeleccionado)"
                                                                           >
                                                                                <template v-slot:selection="data">
                                                                                     <v-chip small color="primary" dark v-text="data.item.name"></v-chip>
                                                                                </template>
                                                                                <template v-slot:item="data">
                                                                                     <v-list-item-avatar size="80">
                                                                                          <v-img :src="data.item.avatar" contain></v-img>
                                                                                     </v-list-item-avatar>
                                                                                     <v-list-item-content>
                                                                                          <v-list-item-title v-html="data.item.name"> </v-list-item-title>
                                                                                     </v-list-item-content>
                                                                                </template>
                                                                           </v-autocomplete>
                                                                      </v-col>
                                                                      <v-col cols="12" sm="12" md="12" lg="12">
                                                                           <v-select
                                                                                v-model="versionSeleccionada"
                                                                                :items="listaVersiones"
                                                                                item-text="version"
                                                                                item-value="cod_tdp"
                                                                                label="Versión"
                                                                                prepend-inner-icon="mdi-car"
                                                                                :menu-props="{ bottom: true, offsetY: true }"
                                                                                hide-details
                                                                                outlined
                                                                                rounded
                                                                                dense
                                                                                :disabled="isEnable"
                                                                                color="primary"
                                                                           >
                                                                                <template v-slot:selection="data">
                                                                                     <v-chip x-small color="primary" dark v-text="data.item.cod_tdp"></v-chip>
                                                                                     {{ data.item.version }}
                                                                                </template>
                                                                                <template v-slot:item="data">
                                                                                     <v-list-item-avatar size="80">
                                                                                          <v-img :src="data.item.model.avatar" contain></v-img>
                                                                                     </v-list-item-avatar>
                                                                                     <v-list-item-content>
                                                                                          <v-list-item-title v-html="data.item.version"></v-list-item-title>
                                                                                          <v-list-item-subtitle v-html="data.item.cod_tdp"></v-list-item-subtitle>
                                                                                     </v-list-item-content>
                                                                                </template>
                                                                           </v-select>
                                                                      </v-col>
                                                                 </v-row>
                                                            </v-card-text>
                                                            <v-card-subtitle class="text-uppercase primary--text">Asesor de Ventas</v-card-subtitle>
                                                            <v-card-text>
                                                                 <v-row>
                                                                      <v-col cols="12" sm="12" md="8" lg="4">
                                                                           <v-select
                                                                                v-model="sucursalSeleccionada"
                                                                                :items="listaSucursales"
                                                                                item-value="name"
                                                                                label="Sucursal"
                                                                                prepend-inner-icon="mdi-domain"
                                                                                hide-details
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                :disabled="isEnable"
                                                                                color="primary"
                                                                                :menu-props="{ bottom: true, offsetY: true }"
                                                                                v-on:change="getAllAsesores(sucursalSeleccionada)"
                                                                           >
                                                                                <template v-slot:selection="data">
                                                                                     <v-chip dark :color="colorSucursal(data.item.name)" small v-text="data.item.name"> </v-chip>
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
                                                                                          <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                                                                     </v-list-item-content>
                                                                                </template>
                                                                           </v-select>
                                                                      </v-col>
                                                                      <v-col cols="12" sm="12" md="8" lg="8">
                                                                           <v-autocomplete
                                                                                v-model="asesorSeleccionado"
                                                                                :items="listaAsesores"
                                                                                label="Asesor de Ventas"
                                                                                prepend-inner-icon="mdi-account-box"
                                                                                color="primary"
                                                                                outlined
                                                                                rounded
                                                                                dense
                                                                                hide-details
                                                                                :disabled="isEnable"
                                                                                item-text="name"
                                                                                :menu-props="{ bottom: true, offsetY: true }"
                                                                           >
                                                                                <template v-slot:selection="data">
                                                                                     <v-chip small color="primary">{{ data.item.name }}</v-chip>
                                                                                </template>
                                                                                <template v-slot:item="data">
                                                                                     <v-list-item-avatar size="60">
                                                                                          <v-img :src="data.item.avatar" :lazy-src="data.item.name"></v-img>
                                                                                     </v-list-item-avatar>
                                                                                     <v-list-item-content>
                                                                                          <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                                                                          <v-list-item-title>
                                                                                               <v-chip x-small color="primary" v-text="data.item.marca.name"></v-chip>
                                                                                          </v-list-item-title>
                                                                                     </v-list-item-content>
                                                                                </template>
                                                                           </v-autocomplete>
                                                                      </v-col>
                                                                 </v-row>
                                                            </v-card-text>
                                                            <v-card-subtitle class="text-uppercase primary--text">Financiamiento</v-card-subtitle>
                                                            <v-card-text>
                                                                 <v-row>
                                                                      <v-col cols="12" sm="12" md="12" lg="4">
                                                                           <v-select
                                                                                v-model="financiamientoSeleccionado"
                                                                                :items="listaFinanciamientos"
                                                                                item-value="name"
                                                                                item-text="name"
                                                                                label="Tipo Financiamiento"
                                                                                prepend-inner-icon="mdi-bank"
                                                                                outlined
                                                                                rounded
                                                                                dense
                                                                                hide-details
                                                                                :disabled="isEnable"
                                                                                color="primary"
                                                                                :menu-props="{ bottom: true, offsetY: true }"
                                                                           >
                                                                                <template v-slot:selection="data">
                                                                                     <v-chip color="primary" x-small v-text="data.item.name"></v-chip>
                                                                                </template>
                                                                                <template v-slot:item="data">
                                                                                     <v-list-item-avatar>
                                                                                          <v-icon v-if="data.item.name == 'CONTADO'" color="primary">mdi-cash</v-icon>
                                                                                          <v-icon color="primary" v-else>mdi-bank</v-icon>
                                                                                     </v-list-item-avatar>
                                                                                     <v-list-item-content>
                                                                                          <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                                                                     </v-list-item-content>
                                                                                </template>
                                                                           </v-select>
                                                                      </v-col>
                                                                      <v-col v-if="financiamientoSeleccionado == 'CREDITO'" cols="12" sm="12" md="12" lg="4">
                                                                           <v-select
                                                                                v-model="bancoSeleccionado"
                                                                                :items="listaBancos"
                                                                                item-value="name"
                                                                                item-text="name"
                                                                                label="Entidad Bancaria"
                                                                                prepend-inner-icon="mdi-bank"
                                                                                outlined
                                                                                rounded
                                                                                dense
                                                                                :disabled="isEnable"
                                                                                hide-details
                                                                                color="primary"
                                                                                :menu-props="{ bottom: true, offsetY: true }"
                                                                           >
                                                                                <template v-slot:selection="data">
                                                                                     <v-chip color="primary" x-small v-text="data.item.name"></v-chip>
                                                                                </template>
                                                                                <template v-slot:item="data">
                                                                                     <v-list-item-avatar size="60">
                                                                                          <v-img :src="data.item.avatar" contain></v-img>
                                                                                     </v-list-item-avatar>
                                                                                     <v-list-item-content>
                                                                                          <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                                                                     </v-list-item-content>
                                                                                </template>
                                                                           </v-select>
                                                                      </v-col>
                                                                      <v-col v-if="financiamientoSeleccionado == 'CREDITO'" cols="12" sm="12" md="12" lg="4">
                                                                           <v-text-field
                                                                                class="centered-input text--darken-1"
                                                                                v-model="editedItem.tentativa_inicial"
                                                                                label="Tentativa de Inical"
                                                                                prepend-inner-icon="mdi-cash"
                                                                                :hint="editedItem.tentativa_inicial.length < 3 ? 'Valor en porcentaje' : 'Monto en dólares'"
                                                                                persistent-hint
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                :disabled="isEnable"
                                                                                :prefix="editedItem.tentativa_inicial.length >= 3 ? '$' : ''"
                                                                                :suffix="editedItem.tentativa_inicial.length <= 2 ? '%' : '.00'"
                                                                           ></v-text-field>
                                                                      </v-col>
                                                                      <v-col v-show="false" v-if="financiamientoSeleccionado == 'CONTADO'" cols="12" sm="12" md="12" lg="4">
                                                                           <v-text-field
                                                                                class="centered-input text--darken-1"
                                                                                v-model="editedItem.precioUnidad"
                                                                                label="Precio Tentativo"
                                                                                prepend-inner-icon="mdi-cash"
                                                                                hide-details
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                :disabled="isEnable"
                                                                                prefix="$"
                                                                                suffix=".00"
                                                                           ></v-text-field>
                                                                      </v-col>
                                                                 </v-row>
                                                            </v-card-text>
                                                       </v-row>
                                                  </v-col>
                                             </v-row>
                                        </v-col>
                                        <v-col cols="12" sm="4" md="4" lg="4">
                                             <v-card class="mx-auto" max-width="350">
                                                  <v-card-title class="primary white--text">
                                                       <span class="text-h6 text-uppercase">Logs</span>
                                                  </v-card-title>
                                                  <v-card-text class="py-0">
                                                       <v-timeline align-top dense>
                                                            <v-timeline-item color="cyan" small>
                                                                 <v-row class="pt-1">
                                                                      <v-col cols="6">
                                                                           <strong>{{ editedItem.fecha_ingreso }}</strong>
                                                                      </v-col>
                                                                      <v-col>
                                                                           <strong v-text="editedItem.isIngresado ? 'Fecha Ingreso' : ''"></strong>
                                                                      </v-col>
                                                                 </v-row>
                                                            </v-timeline-item>
                                                            <v-timeline-item v-if="editedItem.isNoInteresado" color="blue" small fill-dot icon="mdi-delete-forever">
                                                                 <v-row class="pt-1">
                                                                      <v-col cols="6">
                                                                           <strong v-text="editedItem.isNoInteresado ? editedItem.fecha_noInteresado : ''"></strong>
                                                                      </v-col>
                                                                      <v-col>
                                                                           <strong v-text="editedItem.isNoInteresado ? 'No Interesado' : ''"></strong>
                                                                      </v-col>
                                                                 </v-row>
                                                            </v-timeline-item>
                                                            <v-timeline-item v-if="editedItem.isAtendido" color="amber" small fill-dot icon="mdi-shield">
                                                                 <v-row class="pt-1">
                                                                      <v-col cols="6">
                                                                           <strong v-text="editedItem.isAtendido !== null ? editedItem.fecha_atencion : ''"></strong>
                                                                      </v-col>
                                                                      <v-col>
                                                                           <strong v-text="editedItem.isAtendido ? 'Atendido' : ''"></strong>
                                                                      </v-col>
                                                                 </v-row>
                                                            </v-timeline-item>
                                                            <v-timeline-item v-if="editedItem.isAsignado" color="orange" small fill-dot icon="mdi-account">
                                                                 <v-row class="pt-1">
                                                                      <v-col cols="6">
                                                                           <strong v-text="editedItem.isAsignado !== null ? editedItem.fecha_asignacion : ''"></strong>
                                                                      </v-col>
                                                                      <v-col>
                                                                           <strong v-text="editedItem.isAsignado ? 'Asignado' : ''"></strong>
                                                                      </v-col>
                                                                 </v-row>
                                                            </v-timeline-item>
                                                            <v-timeline-item v-if="editedItem.isDeclinado" color="pink" small fill-dot icon="mdi-close">
                                                                 <v-row class="pt-1">
                                                                      <v-col cols="6">
                                                                           <strong v-text="editedItem.isDeclinado !== null ? editedItem.fecha_declinado : ''"></strong>
                                                                      </v-col>
                                                                      <v-col>
                                                                           <strong v-text="editedItem.isDeclinado ? 'Declinada' : ''"></strong>
                                                                      </v-col>
                                                                 </v-row>
                                                            </v-timeline-item>
                                                            <v-timeline-item v-if="editedItem.isConvertido" color="green" small fill-dot icon="mdi-check">
                                                                 <v-row class="pt-1">
                                                                      <v-col cols="6">
                                                                           <strong v-text="editedItem.isConvertido !== null ? editedItem.fecha_conversion : ''"></strong>
                                                                      </v-col>
                                                                      <v-col>
                                                                           <strong v-text="editedItem.isConvertido ? 'Convertido' : ''"></strong>
                                                                      </v-col>
                                                                 </v-row>
                                                            </v-timeline-item>
                                                       </v-timeline>
                                                  </v-card-text>
                                             </v-card>
                                        </v-col>
                                   </v-row>
                              </div>
                         </v-card-text>
                         <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn x-large color="primary" class="mx-5 mb-5" dark @click="irVistaLeads">
                                   <v-icon left large dark class="mr-5">mdi-cancel</v-icon>
                                   <span v-if="!isEnable">Cancelar</span>
                                   <span v-else>Cerrar</span>
                              </v-btn>
                              <v-btn v-if="!isEnable" x-large class="mx-5 mb-5" color="secondary" :loading="loadingG" :disabled="loadingG" @click="loaderG = 'loadingG'">
                                   <v-icon left large dark class="mr-5">mdi-content-save</v-icon>
                                   Guardar
                                   <template v-slot:loader>
                                        <span class="custom-loader">
                                             <v-icon>mdi-cached</v-icon>
                                        </span>
                                   </template>
                              </v-btn>
                         </v-card-actions>
                    </v-card>
               </v-col>
          </v-row>
          <!-- 		<br>
		<pre>
			{{editedItem}}
		</pre> -->
     </div>
</template>
<script>
import * as pro from "../../plugins/helper";

export default {
     data() {
          return {
               editedIndex: true,
               isEnable: true,
               editedItem: {
                    comentario: "",
                    observacion: "",
                    motivo_rechazo: "",
                    motivo_desistencia: "",
                    tentativa_inicial: 0,
                    precioUnidad: 0,
                    entidad_bancaria: null,
               },
               //API ESTADOS
               estadoSeleccionado: "",
               listaEstados: [],
               //API MARCA
               marcaSeleccionada: "",
               listaMarcas: [],
               //API MODELO
               modeloSeleccionado: "",
               listaModelos: [],
               //API VERSIONES
               versionSeleccionada: "",
               listaVersiones: [],
               //API SUCURSAL
               sucursalSeleccionada: "",
               listaSucursales: [],
               //API ASESORES
               asesorSeleccionado: "",
               listaAsesores: [],
               //API FINANCIAMIENTO
               financiamientoSeleccionado: "",
               listaFinanciamientos: [],
               //API BANCOS
               bancoSeleccionado: "",
               listaBancos: [],
               //API MOTIVOS DE RECHAZO
               motivosRechazoSeleccionado: "",
               listaMotivosRechazo: [],
               //Serie Tiempo
               items: [],
               loaderG: null,
               loadingG: null,
          };
     },

     watch: {
          loaderG(val) {
               let l = this.loaderG;
               this[l] = !this[l];

               val &&
                    setTimeout(() => {
                         this[l] = false;
                         // console.log('Empieza en 5 seg');
                    }, 6000);

               val &&
                    setTimeout(() => {
                         this.guardarCambiosLead();
                         // console.log('Empieza en 1 seg');
                    }, 1000);

               this.loaderG = null;
          },
     },

     computed: {
          titlePage() {
               return this.editedIndex ? "VISUALIZACIÓN DE LEAD" : "EDICIÓN DE LEAD";
          },
     },

     created() {
          this.inicializar();
     },

     methods: {
          inicializar() {
               this.cargarItemActivo();
               this.initCombos();
          },

          initCombos() {
               this.cargarEstadosActivos();
               this.getAllMarcas();
               this.getSucursalesActivas();
               this.getAllTiposFinanciamiento();
               this.getAllBancos();
               this.getAllMotivosRechazo();
          },

          async cargarEstadosActivos() {
               try {
                    const query = await axios.get("status/activos");
                    if (query.status == 200) {
                         this.listaEstados = query.data.active_status;
                    }
               } catch (err) {
                    pro.capturarError(err.response);
               }
          },

          async getSucursalesActivas() {
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

          async getAllVersiones(byModelo) {
               let obj = {};
               obj.modelo = byModelo;

               try {
                    const query = await axios.post("vehicles/by-modelo", obj);

                    if (query.status == 200) {
                         this.listaVersiones = query.data.vehicles;
                    }
               } catch (err) {
                    pro.capturarError(err.response);
               }
          },

          async getAllAsesores(sucursal) {
               let obj = {};
               obj.sucursal = sucursal;

               try {
                    const query = await axios.post("sellers/by-sucursal", obj);
                    if (query.status == 200) {
                         this.listaAsesores = query.data.deploy;
                    }
               } catch (err) {
                    pro.capturarError(err.response);
               }
          },

          async getAllTiposFinanciamiento() {
               try {
                    const query = await axios.get("finances/activos");
                    if (query.status == 200) {
                         this.listaFinanciamientos = query.data.active_finances;
                    }
               } catch (err) {
                    pro.capturarError(err.response);
               }
          },

          async getAllBancos() {
               try {
                    const query = await axios.get("bancos/activos");
                    if (query.status == 200) {
                         this.listaBancos = query.data.entidades_activas;
                    }
               } catch (err) {
                    pro.capturarError(err.response);
               }
          },

          async getAllMotivosRechazo() {
               try {
                    const query = await axios.get("motivo-rechazo/activos");
                    if (query.status == 200) {
                         this.listaMotivosRechazo = query.data.all_active;
                    }
               } catch (err) {
                    pro.capturarError(err.response);
               }
          },

          async cargarItemActivo() {
               let codigo = this.$route.params.leadId;

               try {
                    const query = await axios.get("leads/" + codigo);
                    // console.log(query);

                    if (query.status == 200) {
                         this.editedItem = query.data.one;
                         // this.creandoSerieTiempo();

                         this.editedItem.codigo = query.data.one._id;
                         this.editedItem.fecha_ingreso = pro.formatearFecha(query.data.one.fecha_ingreso, true);
                         this.editedItem.dataOrigin = query.data.one.dataOrigin.name;
                         this.estadoSeleccionado = query.data.one.estado_lead;
                         this.motivosRechazoSeleccionado = pro.validarVacios(query.data.one.motivoDesplegable) ? "" : query.data.one.motivoDesplegable.name;
                         //Vehiculo
                         this.marcaSeleccionada = pro.validarVacios(query.data.one.auto) ? "" : query.data.one.auto.model.marca.name;
                         if (!pro.validarVacios(this.marcaSeleccionada)) this.getAllModelos(this.marcaSeleccionada);
                         this.modeloSeleccionado = pro.validarVacios(query.data.one.auto) ? "" : query.data.one.auto.model.name;
                         if (!pro.validarVacios(this.modeloSeleccionado)) this.getAllVersiones(this.modeloSeleccionado);
                         this.versionSeleccionada = pro.validarVacios(query.data.one.auto) ? "" : query.data.one.auto.cod_tdp;
                         //Asesor
                         this.sucursalSeleccionada = pro.validarVacios(query.data.one.sucursal_lead) ? query.data.one.asesorAsignado.sucursal.name : query.data.one.sucursal_lead.name;
                         if (!pro.validarVacios(this.sucursalSeleccionada)) this.getAllAsesores(this.sucursalSeleccionada);
                         this.asesorSeleccionado = pro.validarVacios(query.data.one.asesorAsignado) ? "" : query.data.one.asesorAsignado.name;
                         //Financiamiento
                         this.financiamientoSeleccionado = pro.validarVacios(query.data.one.tipoFinanciamiento) ? "" : query.data.one.tipoFinanciamiento.name;
                         this.bancoSeleccionado = pro.validarVacios(query.data.one.entidad_bancaria) ? "" : query.data.one.entidad_bancaria.name;
                         //Fechas
                         this.editedItem.fecha_noInteresado = pro.validarVacios(query.data.one.fecha_noInteresado) ? "" : pro.formatearFecha(query.data.one.fecha_noInteresado, true);
                         this.editedItem.fecha_atencion = pro.validarVacios(query.data.one.fecha_atencion) ? "" : pro.formatearFecha(query.data.one.fecha_atencion, true);
                         this.editedItem.fecha_asignacion = pro.validarVacios(query.data.one.fecha_asignacion) ? "" : pro.formatearFecha(query.data.one.fecha_asignacion, true);
                         this.editedItem.fecha_declinado = pro.validarVacios(query.data.one.fecha_declinado) ? "" : pro.formatearFecha(query.data.one.fecha_declinado, true);
                         this.editedItem.fecha_conversion = pro.validarVacios(query.data.one.fecha_conversion) ? "" : pro.formatearFecha(query.data.one.fecha_conversion, true);
                    }
               } catch (err) {
                    // console.log(err);
                    // console.log(err.response);
                    pro.capturarError(err.response);
               }
          },

          colorSucursal(item) {
               return pro.colorearSucursal(item);
          },

          obtenerSuc(item) {
               return pro.abreviaturaSucursal(item);
          },

          colorStatus(item) {
               return pro.colorearEstadoLead(item);
          },

          setIconMotivos(item) {
               return pro.iconMotivoRechazo(item);
          },

          irVistaLeads() {
               this.$router.push("/leads/list");
          },

          habilitadEdicion() {
               this.editedIndex = !this.editedIndex;
               this.isEnable = !this.isEnable;
          },

          async guardarCambiosLead() {
               console.log("Cambios");
               let id = this.editedItem.codigo;

               let newObj = {
                    //No Interesado
                    estado_lead: this.estadoSeleccionado,
                    isNoInteresado: true,
                    fecha_noInteresado: pro.formatearFecha(new Date(), true),
                    motivoDesplegable: this.motivosRechazoSeleccionado,
                    motivo_rechazo: this.editedItem.motivo_rechazo,
                    //Atendido
                    isAtendido: true,
                    fecha_atencion: pro.formatearFecha(new Date(), true),
                    comentario: this.editedItem.comentario,
                    observacion: this.editedItem.observacion,
                    sucursal: this.sucursalSeleccionada,
                    auto: this.versionSeleccionada,
                    financiamiento: this.financiamientoSeleccionado,
                    entidad_bancaria: this.bancoSeleccionado == "" ? null : this.bancoSeleccionado,
                    tentativa_inicial: this.editedItem.tentativa_inicial,
                    precioUnidad: this.editedItem.precioUnidad,
                    //Asignado
                    isAsignado: true,
                    fecha_asignacion: pro.formatearFecha(new Date(), true),
                    asesorAsignado: this.asesorSeleccionado,
                    //Declinado
                    isDeclinado: true,
                    fecha_declinado: pro.formatearFecha(new Date(), true),
                    motivo_desistencia: this.editedItem.motivo_desistencia,
                    //Convertido
                    estado_conversion: "SEGUIMIENTO",
                    isConvertido: true,
                    fecha_conversion: pro.formatearFecha(new Date(), true),
               };

               // console.log('Cod_Lead:', id);
               // console.log('Cambios',newObj);

               let query = null;
               try {
                    if (this.estadoSeleccionado == "NO INTERESADO") {
                         query = await axios.patch("leads/update/interested/" + id, newObj);

                         if (query.status == 200) {
                              pro.alertaExitosa(query.data.message);
                         }
                    } else if (this.estadoSeleccionado == "ATENDIDO") {
                         query = await axios.patch("leads/update/attended/" + id, newObj);

                         if (query.status == 200) {
                              pro.alertaExitosa(query.data.message);
                         }
                    } else if (this.estadoSeleccionado == "ASIGNADO") {
                         query = await axios.patch("leads/update/assigned/" + id, newObj);

                         if (query.status == 200) {
                              pro.alertaExitosa(query.data.message);
                         }
                    } else if (this.estadoSeleccionado == "DECLINADO") {
                         query = await axios.patch("leads/update/cancelled/" + id, newObj);

                         if (query.status == 200) {
                              pro.alertaExitosa(query.data.message);
                         }
                    } else if (this.estadoSeleccionado == "CONVERTIDO") {
                         query = await axios.patch("leads/update/changed/" + id, newObj);

                         if (query.status == 200) {
                              pro.alertaExitosa(query.data.message);
                         }
                    }

                    this.cargarItemActivo();
                    this.isEnable = true;

                    // this.irVistaLeads();
               } catch (err) {
                    pro.capturarError(err.response);
               }
          },
     },
};
</script>
<style scoped>
.centered-input >>> input {
     text-align: center;
     font-size: 16px;
}

.fondoTitulo {
     background-color: #d50000;
     color: white;
}

.borde {
     border: 1px solid red;
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
