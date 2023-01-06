<template>
    <div class="mx-5 my-5">
        <v-col cols="12" sm="12" md="12" lg="12">
            <v-card outlined flat>
                <v-card-title class="text-uppercase display-2 fondoTitulo">
                    <v-icon dark large left>mdi-tag</v-icon>
                    Nuevo Lead
                </v-card-title>
                <v-card-text>
                    <div class="mx-5 my-5">
                        <v-row>
                            <v-col cols="12" sm="12" md="6" lg="6">
                                <v-text-field
                                    class="centered-input text--darken-3"
                                    v-model="fecha_ingreso"
                                    label="Fecha Registro"
                                    prepend-inner-icon="mdi-calendar"
                                    color="primary"
                                    hide-details
                                    outlined
                                    dense
                                    disabled
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" lg="6">
                                <v-select
                                    v-model="estadoSeleccionado"
                                    :items="listaEstados"
                                    label="Estado"
                                    item-text="name"
                                    item-value="name"
                                    prepend-inner-icon="mdi-swap-horizontal"
                                    color="primary"
                                    hide-details
                                    outlined
                                    dense
                                    disabled
                                    :menu-props="{ bottom: true, offsetY: true }"
                                >
                                    <template v-slot:selection="data">
                                        <v-chip small dark :color="colorStatus(data.item.name)" v-text="data.item.name"></v-chip>
                                    </template>
                                    <template v-slot:item="data">
                                        <v-list-item-avatar size="40" class="white--text" :color="colorStatus(data.item.name)"> {{ data.item.value }}% </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                        </v-list-item-content>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" lg="6">
                                <v-select
                                    v-model="originSeleccionado"
                                    :items="listaOrigenes"
                                    label="Origen"
                                    color="primary"
                                    placeholder="Seleccione origen"
                                    :prepend-inner-icon="originSeleccionado == 'WHATSAPP' ? 'mdi-whatsapp' : 'mdi-facebook'"
                                    item-text="name"
                                    item-value="name"
                                    hide-details
                                    outlined
                                    dense
                                    :menu-props="{ bottom: true, offsetY: true }"
                                >
                                    <template v-slot:selection="data">
                                        <v-chip x-small dark :color="colorSocial(data.item.name)" v-text="data.item.name"></v-chip>
                                    </template>
                                    <template v-slot:item="data">
                                        <v-list-item-avatar :color="colorSocial(data.item.name)">
                                            <v-icon dark v-if="data.item.name == 'WHATSAPP'">mdi-whatsapp</v-icon>
                                            <v-icon dark v-else-if="data.item.name == 'GOOGLE'">mdi-google</v-icon>
                                            <v-icon dark v-else-if="data.item.name == 'PIXEL'">mdi-google-downasaur</v-icon>
                                            <v-icon dark v-else-if="data.item.name == 'TWITTER'">mdi-twitter</v-icon>
                                            <v-icon dark v-else-if="data.item.name == 'CANAL AUTONORT'">mdi-web</v-icon>
                                            <v-icon dark v-else-if="data.item.name == 'WEB TOYOTA'">mdi-webhook</v-icon>
                                            <v-icon dark v-else>mdi-facebook</v-icon>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                        </v-list-item-content>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" lg="6">
                                <v-select
                                    v-model="marcaSeleccionada"
                                    :items="listaMarcas"
                                    item-text="name"
                                    item-value="name"
                                    label="Marca"
                                    hide-details
                                    prepend-inner-icon="mdi-tag"
                                    placeholder="Seleccione Marca"
                                    :menu-props="{ bottom: true, offsetY: true }"
                                    outlined
                                    dense
                                    clearable
                                >
                                    <template v-slot:selection="{ item }">
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
                <v-divider></v-divider>
                <v-card-text>
                    <div class="mx-5 my-5">
                        <v-row>
                            <v-col cols="12" sm="12" md="12" lg="5">
                                <v-text-field
                                    class="centered-input text--darken-3"
                                    v-model="editedItem.customer_name"
                                    label="Cliente"
                                    prepend-inner-icon="mdi-account-circle"
                                    color="primary"
                                    placeholder="Ingrese cliente"
                                    outlined
                                    hide-details
                                    dense
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" lg="2">
                                <v-radio-group class="my-auto" v-model="typeDocument" hide-details mandatory dense row>
                                    <v-radio label="DNI" value="1"></v-radio>
                                    <v-radio label="RUC" value="2"></v-radio>
                                </v-radio-group>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" lg="2">
                                <v-text-field
                                    class="centered-input text--darken-3"
                                    v-model="editedItem.customer_document"
                                    :label="typeDocument == 1 ? 'DNI' : 'RUC'"
                                    prepend-inner-icon="mdi-tag"
                                    color="primary"
                                    placeholder="Documento"
                                    :maxLength="typeDocument == 1 ? 8 : 11"
                                    outlined
                                    hide-details
                                    dense
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" lg="3">
                                <v-select
                                    v-model="ciudadSeleccionada"
                                    :items="listaCiudades"
                                    label="Ciudad"
                                    hide-details
                                    dense
                                    prepend-inner-icon="mdi-map marker"
                                    outlined
                                    item-text="name"
                                    :menu-props="{ bottom: true, offsetY: true }"
                                >
                                    <template v-slot:selection="data">
                                        <v-chip color="primary" small v-text="data.item.name"></v-chip>
                                    </template>
                                    <template v-slot:item="data">
                                        <v-list-item-avatar>
                                            <v-icon color="blue-grey darken-1">mdi-map-marker</v-icon>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                        </v-list-item-content>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" lg="3">
                                <v-text-field
                                    class="centered-input text--darken-3"
                                    v-model="editedItem.customer_cellphone"
                                    label="Celular 01"
                                    prepend-inner-icon="mdi-phone"
                                    color="primary"
                                    placeholder="Ingrese celular"
                                    maxLength="9"
                                    outlined
                                    hide-details
                                    dense
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" lg="3">
                                <v-text-field
                                    class="centered-input text--darken-3"
                                    v-model="editedItem.customer_cellphone2"
                                    label="Celular 02"
                                    prepend-inner-icon="mdi-phone"
                                    color="primary"
                                    placeholder="Ingrese celular"
                                    maxLength="9"
                                    outlined
                                    hide-details
                                    dense
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" lg="6">
                                <v-text-field
                                    class="centered-input text--darken-3"
                                    v-model="editedItem.customer_email"
                                    label="Email"
                                    prepend-inner-icon="mdi-at"
                                    color="primary"
                                    placeholder="Ingrese email"
                                    type="email"
                                    outlined
                                    hide-details
                                    dense
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark large @click="irVistaLeads">
                        <v-icon left dark>mdi-cancel</v-icon>
                        Cancelar
                    </v-btn>
                    <v-btn color="secondary" :loading="loadingG" :disabled="loadingG" large @click="loaderG = 'loadingG'">
                        Guardar
                        <v-icon right dark>mdi-content-save</v-icon>
                        <template v-slot:loader>
                            <span class="custom-loader">
                                <v-icon>mdi-cached</v-icon>
                            </span>
                        </template>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </div>
</template>
<script>
import * as pro from "../../plugins/helper";
import { mapActions, mapState } from "vuex";

export default {
    data() {
        return {
            //API ORIGEN
            originSeleccionado: "",
            listaOrigenes: [],
            //API ESTADO
            estadoSeleccionado: "INGRESADO",
            listaEstados: [],
            //API CIUDAD
            ciudadSeleccionada: "",
            listaCiudades: [],
            //API MARCA
            marcaSeleccionada: "",
            listaMarcas: [],
            //Item
            typeDocument: 1,
            editedItem: {
                dataOrigin: "",
                customer_name: "",
                customer_document: "",
                customer_cellphone1: "",
                customer_cellphone2: "",
                customer_email: "",
                customer_city: "",
                fecha_ingreso: "",
                createdBy: "",
            },
            loaderG: null,
            loadingG: null,
        };
    },

    watch: {
        loaderG(val) {
            let a = this.loaderG;
            this[a] = !this[a];

            val &&
                setTimeout(() => {
                    this[a] = false;
                }, 6000);

            val &&
                setTimeout(() => {
                    this.guardarItem();
                }, 1000);

            this.loaderG = null;
        },
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

        fecha_ingreso() {
            return pro.formatearFecha(new Date(), true);
        },
    },

    created() {
        this.detectarUsuario(this.userConectado);
        this.initCombos();
    },

    methods: {
        ...mapActions(["detectarUsuario"]),
        initCombos() {
            this.getAllOriginsActive();
            this.getAllCitiesActive();
            this.getAllEstadosActivos();
            this.getComboMarcaActive();
        },

        async getAllOriginsActive() {
            try {
                const query = await axios.get("origin/activos");
                if (query.status == 200) {
                    this.listaOrigenes = query.data.active_origins;
                }
            } catch (err) {
                pro.capturarError(err.response);
            }
        },

        async getAllCitiesActive() {
            try {
                const query = await axios.get("city/activos");
                if (query.status == 200) {
                    this.listaCiudades = query.data.active_cities;
                }
            } catch (err) {
                pro.capturarError(err.response);
            }
        },

        async getAllEstadosActivos() {
            try {
                const query = await axios.get("status/activos");
                if (query.status == 200) {
                    this.listaEstados = query.data.active_status;
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
                    this.listaMarcas = query.data.active_brands.filter((a) => a.name == "TOYOTA" || a.name == "HINO");
                }
                // console.log(this.listaMarcas);
            } catch (err) {
                pro.capturarError(err.response);
            }
        },

        colorSocial(item) {
            return pro.colorearRedSocial(item);
        },

        colorStatus(item) {
            return pro.colorearEstadoLead(item);
        },

        irVistaLeads() {
            this.$router.push("/leads/list");
        },

        async guardarItem() {
            // console.log("guardar Item");

            const colaborador = await axios.get("users/" + this.$store.state.user.userCod);

            let newObj = {};
            newObj.codigo_interno = new Date().getTime();
            newObj.dataOrigin = this.originSeleccionado;
            newObj.marcaVehiculo = this.marcaSeleccionada;
            newObj.marcaVehiculoE = this.marcaSeleccionada;
            newObj.customer_name = this.editedItem.customer_name;
            newObj.customer_document = this.editedItem.customer_document;
            newObj.customer_city = this.ciudadSeleccionada;
            newObj.customer_cellphone = this.editedItem.customer_cellphone;
            newObj.customer_cellphone2 = this.editedItem.customer_cellphone2;
            newObj.customer_email = this.editedItem.customer_email;
            newObj.fecha_ingreso = this.fecha_ingreso;
            newObj.createdBy = colaborador.data.founded.username;

            // console.log('Cliente/Lead:', newObj);

            if (this.validarFormulario(newObj)) {
                try {
                    const query = await axios.post("leads", newObj);

                    if (query.status == 200) {
                        pro.alertaExitosa(query.data.message);
                        this.irVistaLeads();
                    }
                } catch (err) {
                    pro.capturarError(err.response);
                }
            }
        },

        validarFormulario(item) {
            let msg = [];

            if (pro.validarVacios(item.customer_name)) {
                msg.push("Cliente");
            }

            if (pro.validarVacios(this.originSeleccionado)) {
                msg.push("Origen");
            }

            // if(pro.validarVacios(item.customer_document)){
            //     msg.push('Documento');
            // }

            if (pro.validarVacios(item.customer_cellphone)) {
                msg.push("Celular");
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
.centered-input >>> input {
    text-align: center;
    font-size: 18px;
}

.fondoTitulo {
    background-color: #d50000;
    color: white;
    font-family: "Courier New", Courier, monospace;
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
