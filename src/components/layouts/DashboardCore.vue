<template>
    <div>
        <v-row>
            <v-col cols="12" sm="12" md="12" lg="12">
                <v-card outlined flat raised>
                    <div class="mx-5 my-5">
                        <v-row>
                            <v-col cols="12" sm="4" md="4" lg="4">
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
                                    <v-date-picker v-model="rangoFechas" locale="es" range scrollable color="primary" header-color="primary">
                                        <v-spacer></v-spacer>
                                        <v-btn dark color="primary" @click="modal1 = false"> Cancelar </v-btn>
                                        <v-btn color="secondary" @click="$refs.dialog1.save(rangoFechas)"> OK </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-col>
                            <v-col cols="12" sm="4" md="4" lg="4">
                                <v-btn block elevation="5" color="primary" :loading="loading" :disabled="loading" @click="loader = 'loading'">
                                    <v-icon left>mdi-filter-check</v-icon>
                                    Filtrar
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" sm="12" md="12" lg="12">
                <v-card outlined raised flat>
                    <v-card-title class="primary text-uppercase text-h4 white--text">
                        <v-icon left dark large>mdi-google-ads</v-icon>
                        Flujo de Leads - {{titlePage}}
                        </v-card-title>
                    <v-card-text>
                        <div class="mt-5">
                            <v-row>
                                <v-col cols="12" sm="6" md="6" lg="6">
                                    <contadores-dashboard
										:totalSolicitudes="totalSolicitudes"
										:totalAsignadas="totalAsignadas"
										:totalBooking="totalBooking"
										:totalVentas="totalVentas"
										:closingRate="closingRate"
										:percentAsignadas="totalPercentAsingada"
										:percentBooking="totalPercentBooking"
										:percentVentas="totalPercentVentas"
									/>
                                </v-col>
                                <v-col cols="12" sm="6" md="6" lg="6">
                                    <piramide-leads :tituloGrafico="tituloGrafico" :contentArray="contentArray"/>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import * as pro from "../../plugins/helper";
import ContadoresDashboard from '../ContadoresDashboard';
import PiramideLeads from '../PiramideLeads';

export default {
    components:{
        ContadoresDashboard,
        PiramideLeads
    },

    props:{
        titlePage: String,
        //Contadores
        totalSolicitudes: Number,
        totalAsignadas: Number,
        totalBooking: Number,
        totalVentas: Number,
        closingRate: Number,
        totalPercentAsingada: String,
        totalPercentBooking: String,
        totalPercentVentas: String,
        // Grafico Piramidal
        tituloGrafico: String,
        contentArray: Array,
        // Functions
        getData: Function,
    },

    data() {
        return {
            modal1: false,
            rangoFechas: [
                new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().substr(0, 10),
                new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().substr(0, 10),
            ],
            loading: false,
            loader: null,
        };
    },

    watch:{
        loader(val) {
               let a = this.loader;
               this[a] = !this[a];

               val &&
                    setTimeout(() => {
                         this[a] = false;
                         // console.log('Empieza en 8');
                    }, 6000);
               val &&
                    setTimeout(() => {
                         // console.log('Empieza en 1');
                         this.procesarFiltros();
                    }, 1000);

               this.loader = null;
          },
    },

    computed: {
        fechaTexto() {
            return this.rangoFechas.join(" - ");
        },
    },

    created() {
        this.procesarFiltros();
    },

    methods: {
        procesarFiltros(){
            let obj = {
                rangoFechas: this.rangoFechas
            };
            this.$emit("escucharHijo", obj);
            this.inicializar();
        },
        
        inicializar(){
            if(this.contentArray.length > 0){
                pro.limpiarTabla(this.contentArray);
                this.getData();
            }else{
                this.getData();
            }
        }
    },
};
</script>
<style scoped>
.centered-input >>> input {
    text-align: center;
    font-size: 18px;
}
</style>
