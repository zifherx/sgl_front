<template>
    <div class="mx-5 my-5">
        <v-row>
            <v-col cols="12" sm="12" md="12" lg="12">
                <v-data-table
                    :headers="headerTable"
                    :items="contentTable"
                    sort-by="submodulo"
                    :search="search"
                    class="elevation-1"
                    hide-default-footer
                    :loading="contentTable.length > 0 ? false : true"
                    loading-text="Cargando datos"
                    :items-per-page="itemsPerPage"
                    :page.sync="page"
                    @pagination="contadorItems"
                    @page-count="pageCount = $event"
                >
                    <template v-slot:top>
                        <v-toolbar flat color="primary" dark>
                            <v-avatar class="font-weight-bold" v-text="contador"></v-avatar>
                            <v-toolbar-title class="display-1 text-uppercase" v-text="'SUBMODULOS'"></v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-text-field
                                v-model="search"
                                label="Buscar ..."
                                prepend-inner-icon="mdi-magnify"
                                color="#E0E0E0"
                                background-color="transparent"
                                outlined
                                rounded
                                dense
                                hide-details
                            ></v-text-field>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.submodulo="{item}">
                        <v-avatar size="40" color="primary" class="mx-2">
                            <v-icon color="#E0E0E0">{{item.icon}}</v-icon>
                        </v-avatar>
                        <span class="text-uppercase primary--text font-weight-bold">{{item.submodulo}}</span>
                    </template>
                    <template v-slot:item.ruta="{item}">
                        <v-tooltip color="primary" left>
                            <template v-slot:activator="{attrs,on}">
                                <v-btn small fab dark color="primary" v-bind="attrs" v-on="on" @click="irRuta(item)">
                                    <v-icon>{{item.icon}}</v-icon>
                                </v-btn>
                            </template>
                            <span>Ir a {{item.submodulo}}</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </div>
</template>
<script>
export default {
    data(){
        return{
            search: '',
            page: 1,
            pageCount: 0,
            itemsPerPage: 20,
            contador: 0,
            colorPage: "#D50000",
            //Tabla
            headerTable: [
                {text: 'Submódulo', value: 'submodulo',align: 'left', sortable: false, groupable: false, class: 'text-uppercase text-h5'},
                {text: 'Descripción', value: 'descripcion',align: 'left', sortable: false, groupable: false, class: 'text-uppercase text-h5'},
                {text: 'Ruta', value: 'ruta',align: 'center', sortable: false, groupable: false, class: 'text-uppercase text-h5'},
            ],
            contentTable: [
                { submodulo: 'Bancos', descripcion: 'Gestión de bancos', icon: 'mdi-bank', ruta: 'bank' },
                { submodulo: 'Chasis', descripcion: 'Gestión de chasis', icon: 'mdi-car-door', ruta: 'chasis' },
                { submodulo: 'Ciudad', descripcion: 'Gestión de ciudades', icon: 'mdi-map-marker', ruta: 'city' },
                { submodulo: 'Estados', descripcion: 'Gestión de estados de leads', icon: 'mdi-home-switch', ruta: 'status' },
                { submodulo: 'Estado Conversión', descripcion: 'Gestión de estados de conversión', icon: 'mdi-swap-horizontal', ruta: 'shift' },
                { submodulo: 'Financiamiento', descripcion: 'Gestión de tipos de financiamiento', icon: 'mdi-credit-card', ruta: 'finances' },
                { submodulo: 'Marca', descripcion: 'Gestión de marcas vehiculares', icon: 'mdi-tag', ruta: 'brand' },
                { submodulo: 'Modelo', descripcion: 'Gestión de modelos vehiculares', icon: 'mdi-car', ruta: 'model' },
                { submodulo: 'Motivos de Rechazo', descripcion: 'Gestión de motivos de rechazo', icon: 'mdi-cog', ruta: 'motivo-rechazo' },
                { submodulo: 'Origen Datos', descripcion: 'Gestión de origen de datos', icon: 'mdi-facebook', ruta: 'social-origin' },
                { submodulo: 'Sucursal', descripcion: 'Gestión de sucursales', icon: 'mdi-domain', ruta: 'sucursal' },
            ]
        }
    },

    methods:{
        contadorItems(pagination) {
			this.contador = pagination.itemsLength;
		},

        irRuta(item){
            this.$router.push('/administrative/settings/'+ item.ruta);
        }
    }
}
</script>