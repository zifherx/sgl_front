<template>
    <div class="mx-5 my-5">
        <v-row>
            <v-col cols="12" sm="6" md="6" lg="4">
				<base-material-stats-card
					v-model="totalModelos"
					color="primary"
					icon="mdi-tag"
					value="0"
					title="TOTAL"
				></base-material-stats-card>
			</v-col>
			<v-col cols="12" sm="6" md="6" lg="4">
				<base-material-stats-card
					v-model="totalActive"
					color="primary"
					icon="mdi-swap-horizontal"
					value="0"
					title="ACTIVE"
				></base-material-stats-card>
			</v-col>
        </v-row>
        <v-row>
            <v-col cols="12" sm="12" md="12" lg="12">
                <v-data-iterator
                    :items="contentTable"
                    :search="search"
                    class="elevation-5"
                    group-by="marca"
                    :loading="contentTable.length > 0 ? false : true"
                    loading-text="Cargando Modelos"
                    :items-per-page="itemsPerPage"
                    :page.sync="page"
                    hide-default-footer
                    @pagination="contadorItems"
                >
                    <template v-slot:header>
                        <v-toolbar color="primary">
                            <v-avatar color="white" class="font-weight-bold primary--text mx-1" v-text="contador"></v-avatar>
                            <v-toolbar-title class="display-2 text-uppercase white--text">Modelos</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-text-field
                                v-model="search"
                                prepend-inner-icon="mdi-magnify"
                                label="Buscar..."
                                dense
                                dark
                                clearable
                                outlined
                                rounded
                                hide-details
                            ></v-text-field>
                            <v-dialog v-model="dialogModelo" persistent max-width="500" transition="dialog-bottom-transition">
                                <template v-slot:activator="{attrs,on}">
                                    <v-btn fab dark small class="mx-5" color="primary" v-bind="attrs" v-on="on">
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </template>
                                <v-card elevation="5">
                                    <v-card-title class="fondoTitulo text-uppercase white--text display-2" v-text="titleDialog"></v-card-title>
                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="12" sm="12" md="12" lg="12">
                                                    <v-autocomplete
                                                        v-model="marcaSeleccionada"
                                                        :items="listaMarcas"
                                                        label="Marca"
                                                        prepend-icon="mdi-tag"
                                                        item-text="name"
                                                        color="primary"
                                                        hide-details=""
                                                        :menu-props="{bottom: true, offsetY: true}"
                                                    >
                                                        <template v-slot:selection="data">
                                                            <v-chip small color="primary" dark v-text="data.item.name"></v-chip>
                                                        </template>
                                                        <template v-slot:item="data">
                                                            <v-list-item-avatar size="30">
                                                                <v-img :src="data.item.avatar" contain></v-img>
                                                            </v-list-item-avatar>
                                                            <v-list-item-content>
                                                                <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                                            </v-list-item-content>
                                                        </template>
                                                    </v-autocomplete>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="12" lg="12">
                                                    <v-file-input
                                                        v-model="avatar"
                                                        prepend-icon="mdi-paperclip"
                                                        small-chips
                                                        show-size
                                                        counter
                                                        accept=".png, .jpg, .jpeg"
                                                        label="Avatar"
                                                        clearable
                                                    ></v-file-input>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="7" lg="7">
                                                    <v-text-field
                                                        v-model="editedItem.name"
                                                        label="Modelo"
                                                        placeholder="Ingrese modelo"
                                                        prepend-icon="mdi-car"
                                                        hide-details
                                                        color="primary"
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="5" lg="5">
                                                    <v-switch
                                                        v-model="editedItem.status"
                                                        inset
                                                        :label="editedItem.status ? 'Habilitado' : 'Inhabilitado'"
                                                        prepend-icon="mdi-check"
                                                        hide-details
                                                    ></v-switch>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="12" lg="12">
                                                    <v-card class="mx-auto" elevation="1" max-width="300">
														<v-card-title class="text-uppercase fondoTitulo">Preview</v-card-title>
														<v-card-text>
															<v-container>
																<v-img :src="urlPreview" contain max-width="250"></v-img>
															</v-container>
														</v-card-text>
													</v-card>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" dark @click="closeDialogModelo">Cancelar</v-btn>
                                        <v-btn color="secondary" dark @click="guardarItem">Guardar</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:default="data">
                        <div class="mx-5 my-5">
                            <v-row>
                                <v-col v-for="item in data.items" :key="item.name" cols="12" sm="6" md="4" lg="3">
                                    <v-card max-width="270" outlined>
                                        <v-img :src="item.avatar" height="200" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)">
                                            <v-card-title>
                                                <v-chip color="primary" dark v-text="item.marca"></v-chip>
                                            </v-card-title>
                                        </v-img>
                                        <v-card-subtitle class="text-center">
                                            <span class="font-weight-bold" v-text="item.name"></span> -
                                            <v-chip small dark :color="colorStatus(item.status)" v-text="item.status ? 'ACTIVO' : 'INACTIVO'"></v-chip>
                                        </v-card-subtitle>
                                        <v-divider></v-divider>
                                        <v-card-actions>
                                            <v-avatar size="32">
                                                <v-img :src="item.marcaAvatar" contain></v-img>
                                            </v-avatar>
                                            <v-spacer></v-spacer>
                                            <v-btn icon @click="verItem(item)">
                                                <v-icon color="orange darken-2" >mdi-eye</v-icon>
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
                            <span class="mr-5 grey--text">Página {{page}} de {{numberOfPage}}</span>
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
import * as pro from '../../../../plugins/helper';
import Swal from 'sweetalert2';

export default {
    data(){
        return{
            totalModelos: 0,
            totalActive: 0,
            dialogModelo: false,
            search: '',
            contador: 0,
            page: 1,
            pageCount: 0,
            itemsPerPage: 16,
            headerTable: [],
            contentTable: [],
            editedIndex: -1,
            editedItem: {
                name: '',
                marca: '',
                avatar: '',
                status: true,
                createdBy: ''
            },
            defaultItem: {
                name: '',
                marca: '',
                avatar: '',
                status: true,
                createdBy: ''
            },
            //API MARCA
            marcaSeleccionada: '',
            listaMarcas: [],
            avatar: null
        }
    },

    computed:{
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

        titleDialog(){
            return this.editedIndex === -1 ? 'Nuevo Modelo' : 'Actualizar Modelo';
        },

        numberOfPage(){
            return Math.ceil(this.contentTable.length / this.itemsPerPage);
        },

        urlPreview(){
			if(!this.avatar) return;
			return URL.createObjectURL(this.avatar);
		}
    },

    watch: {
        dialogModelo(val){
            val || this.closeDialogModelo();
        }
    },

    created(){
        this.detectarUsuario(this.userConectado);
        this.inicializar();
    },

    methods:{
        ...mapActions(["detectarUsuario"]),
        inicializar(){
            this.cargarData();
            this.getTotalActiveModels();
            this.initCombos();
        },

        initCombos(){
            this.getActiveBrands();
        },

        closeDialogModelo(){
            this.dialogModelo = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
                this.marcaSeleccionada = '';
                this.avatar = null
            });
        },

        contadorItems(pagination) {
            this.contador = pagination.itemsLength;
        },

        refrescarDatos(){
            pro.limpiarTabla(this.contentTable);
            this.cargarData();
            this.getTotalActiveModels();
        },

        async cargarData(){
            try {
                const query = await axios.get('models');
                // console.log(query);
                if(query.status == 200){
                    this.totalModelos = query.data.total_models;
                    await query.data.all_models.forEach((element) => {
                        let obj = {};

                        obj.codigo = element._id;
                        obj.marca = pro.validarVacios(element.marca) ? '' : element.marca.name;
                        obj.marcaAvatar = pro.validarVacios(element.marca) ? '' : element.marca.avatar;
                        obj.avatar = element.avatar;
                        obj.name = element.name;
                        obj.status = element.status;
                        obj.createdBy = pro.validarVacios(element.createdBy) ? '' : element.createdBy.name;

                        this.contentTable.push(obj);
                    });
                }
            } catch (err) {
                pro.capturarError(err.response);
            }
        },

        async getTotalActiveModels(){
            try {
                const query = await axios.get('models/activos');
                if(query.status == 200){
                    this.totalActive = query.data.total_active;
                }
            } catch (err) {
                pro.capturarError(err.response);
            }
        },

        async getActiveBrands(){
            try {
                const query = await axios.get('brands/activos');
                if(query.status == 200){
                    this.listaMarcas = query.data.active_brands;
                }
            } catch (err) {
                pro.capturarError(err.response);
            }
        },

        verItem(item){
            this.editedIndex = this.contentTable.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.marcaSeleccionada = this.editedItem.marca;
            this.dialogModelo = true;
        },

        eliminarItem(item){
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
                if(result.isConfirmed){
                    try {
                        const query = await axios.delete('models/' + id);
                        if(query.status == 200){
                            pro.alertaExitosa(query.data.message);
                            this.contentTable.splice(this.editedIndex,1);
                        }
                    } catch (err) {
                        pro.capturarError(err.response);
                    }
                }
            });
        },

        async guardarItem(){
            if(this.editedIndex > -1){
                let id = this.editedItem.codigo;
                const formData = new FormData();

                try {
                    formData.append('name', this.editedItem.name);
                    formData.append('marca', this.marcaSeleccionada);
                    formData.append('status', this.editedItem.status);
                    formData.append('avatar', this.avatar);

                    const query = await axios.patch('models/' + id, formData);
                    if(query.status == 200){
                        pro.alertaExitosa(query.data.message);
                        this.closeDialogModelo();
                        this.refrescarDatos();
                    }
                } catch (err) {
                    pro.capturarError(err.response);
                }
            }else{
                if(this.validarCamposVacios(this.editedItem)){
                    try {
                    const employee = await axios.get("users/" + this.$store.state.user.userCod);

                    const formData = new FormData();

                    formData.append('name', this.editedItem.name);
                    formData.append('marca', this.marcaSeleccionada);
                    formData.append('status', this.editedItem.status);
                    formData.append('createdBy', employee.data.founded.username);
                    formData.append('avatar', this.avatar);

                        const query = await axios.post('models', formData);
                        if(query.status == 200){
                            pro.alertaExitosa(query.data.message);
                            this.closeDialogModelo();
                            this.refrescarDatos();
                        }
                    } catch (err) {
                        pro.capturarError(err.response);
                    }
                }
            }
        },

        validarCamposVacios(item){
            let msg = []
            if(item.name == '' || item.name == null) msg.push('Modelo');
            if(msg.length > 0){
                pro.alertaCamposVacios(msg);
                return false;
            }else{
                return true;
            }
        },

        paginaAnterior(){
            if(this.page - 1 <= this.numberOfPage) this.page -= 1;
        },

        paginaSiguiente(){
            if(this.page + 1 <= this.numberOfPage) this.page += 1;
        },

        colorStatus(item) {
            if (item) return "green darken-2";
            else return "red accent-4";
        },
    }
}
</script>
<style>
  .fondoTitulo {
    background-color: #d50000;
    color: white;
  }
</style>
