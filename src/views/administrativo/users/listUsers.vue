<template>
    <div class="mx-5 my-5">
        <v-row>
            <v-col cols="12" sm="4" md="4" lg="4">
                <base-material-stats-card v-model="totalUsers" color="primary" icon="mdi-account-box" value="0" title="TOTAL"></base-material-stats-card>
            </v-col>
            <v-col cols="12" sm="4" md="4" lg="4">
                <base-material-stats-card v-model="totalUsersActive" color="primary" icon="mdi-account-circle" value="0" title="ACTIVOS"></base-material-stats-card>
            </v-col>
            <v-col cols="12" sm="4" md="4" lg="4">
                <base-material-stats-card v-model="totalUsersOnline" color="primary" icon="mdi-account-circle" value="0" title="ONLINE"></base-material-stats-card>
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
                    :group-by="groupBy"
                    show-group-by
                    :items-per-page="itemsPerPage"
                    :page.sync="page"
                    @pagination="contadorItems"
                    @page-count="pageCount = $event"
                >
                    <template v-slot:top>
                        <v-toolbar height="150" flat>
                            <v-row>
                                <v-col :cols="$vuetify.breakpoint.xs ? '2' : '1'" class="text-center">
                                    <v-avatar class="white--text" color="primary" v-text="contador"></v-avatar>
                                </v-col>
                                <v-col :cols="$vuetify.breakpoint.xs ? '9' : '4'">
                                    <v-toolbar-title class="text-uppercase mx-5 display-1">Usuarios</v-toolbar-title>
                                </v-col>
                                <v-spacer v-if="$vuetify.breakpoint.xs ? false : true"></v-spacer>
                                <v-col :cols="$vuetify.breakpoint.xs ? '9' : '6'">
                                    <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" outlined hide-details label="Buscar..." class="mx-5"></v-text-field>
                                </v-col>
                                <v-col :cols="$vuetify.breakpoint.xs ? '1' : '1'">
                                    <v-dialog v-model="dialogUser" persistent max-width="600" transition="dialog-bottom-transition">
                                        <template v-slot:activator="{ attrs, on }">
                                            <v-btn fab color="primary" dark v-bind="attrs" v-on="on">
                                                <v-icon large>mdi-plus</v-icon>
                                            </v-btn>
                                        </template>
                                        <v-card outlined flat>
                                            <v-card-title class="text-uppercase text-h4 primary white--text">
                                                <v-icon left dark large>mdi-account-box</v-icon>
                                                {{ titleDialog }}
                                            </v-card-title>
                                            <v-card-text>
                                                <div class="mx-1 my-5">
                                                    <v-row>
                                                        <v-col cols="12" sm="8" md="8" lg="8">
                                                            <v-text-field
                                                                v-model="editedItem.name"
                                                                label="Colaborador"
                                                                prepend-inner-icon="mdi-account-box"
                                                                outlined
                                                                dense
                                                                hide-details
                                                                color="primary"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" sm="4" md="4" lg="4">
                                                            <v-switch
                                                                v-model="editedItem.status"
                                                                hide-details
                                                                inset
                                                                class="my-auto"
                                                                color="primary"
                                                                prepend-inner-icon="mdi-check"
                                                                :label="editedItem.status ? 'Activo' : 'Inactivo'"
                                                            ></v-switch>
                                                        </v-col>
                                                        <v-col cols="12" sm="12" md="12" lg="6">
                                                            <v-text-field
                                                                v-model="editedItem.username"
                                                                label="Usuario"
                                                                prepend-inner-icon="mdi-account-circle"
                                                                hide-details
                                                                outlined
                                                                dense
                                                                color="primary"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <v-col v-if="editedIndex === -1" cols="12" sm="12" md="12" lg="6">
                                                            <v-text-field
                                                                v-model="editedItem.password"
                                                                label="Contraseña"
                                                                prepend-inner-icon="mdi-lock"
                                                                hide-details
                                                                outlined
                                                                dense
                                                                color="primary"
                                                                :type="showPassword ? 'text' : 'password'"
                                                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                                                @click:append="showPassword = !showPassword"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" sm="8" md="8" lg="8">
                                                            <v-text-field
                                                                v-model="editedItem.email"
                                                                label="Email"
                                                                outlined
                                                                dense
                                                                prepend-inner-icon="mdi-at"
                                                                hide-details
                                                                color="primary"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" sm="4" md="4" lg="4">
                                                            <v-text-field
                                                                v-model="editedItem.cellphone"
                                                                label="Celular"
                                                                prepend-inner-icon="mdi-phone"
                                                                hide-details
                                                                outlined
                                                                dense
                                                                color="primary"
                                                                maxLength="9"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" sm="6" md="6" lg="6">
                                                            <v-select
                                                                v-model="sucursalSeleccionada"
                                                                :items="listaSucursales"
                                                                item-text="name"
                                                                item-value="name"
                                                                label="Sucursal"
                                                                outlined
                                                                dense
                                                                prepend-inner-icon="mdi-domain"
                                                                hide-details
                                                                color="primary"
                                                                :menu-props="{ bottom: true, offsetY: true }"
                                                            >
                                                                <template v-slot:selection="{ item }">
                                                                    <v-chip dark :color="colorSucursal(item.name)" x-small v-text="item.name"> </v-chip>
                                                                </template>
                                                                <template v-slot:item="{ item, active, attrs, on }">
                                                                    <v-list-item v-on="on" v-bind="attrs" #default="{ active }">
                                                                        <v-list-item-action>
                                                                            <v-checkbox :input-value="active"></v-checkbox>
                                                                        </v-list-item-action>
                                                                        <v-list-item-content>
                                                                            <v-list-item-title v-html="item.name"></v-list-item-title>
                                                                        </v-list-item-content>
                                                                        <v-list-item-avatar>
                                                                            <v-avatar size="32" class="white--text" :color="colorSucursal(item.name)" v-text="obtenerSuc(item.name)"></v-avatar>
                                                                        </v-list-item-avatar>
                                                                    </v-list-item>
                                                                </template>
                                                            </v-select>
                                                        </v-col>
                                                        <v-col cols="12" sm="6" md="6" lg="6">
                                                            <v-select
                                                                v-model="marcaSeleccionada"
                                                                :items="listaMarcas"
                                                                item-text="name"
                                                                item-value="name"
                                                                label="Marca"
                                                                multiple
                                                                outlined
                                                                dense
                                                                prepend-inner-icon="mdi-tag"
                                                                hide-details
                                                                color="primary"
                                                                :menu-props="{ bottom: true, offsetY: true }"
                                                            >
                                                                <template v-slot:selection="{ item }">
                                                                    <v-chip dark color="primary" x-small v-text="item.name"> </v-chip>
                                                                </template>
                                                                <template v-slot:item="{ item, active, attrs, on }">
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
                                                        <v-col cols="12" sm="12" md="12" lg="12">
                                                            <v-select
                                                                v-model="rolesSeleccionados"
                                                                :items="listaRoles"
                                                                label="Cargos"
                                                                prepend-inner-icon="mdi-tag"
                                                                hide-details
                                                                outlined
                                                                dense
                                                                color="primary"
                                                                item-text="name"
                                                                multiple
                                                                :menu-props="{ bottom: true, offsetY: true }"
                                                            >
                                                                <template v-slot:selection="{ item }">
                                                                    <v-chip small color="primary" v-text="item.name"></v-chip>
                                                                </template>
                                                            </v-select>
                                                        </v-col>
                                                    </v-row>
                                                </div>
                                            </v-card-text>
                                            <v-divider></v-divider>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn color="primary" dark @click="closeDialogUser">
                                                  <v-icon left>mdi-cancel</v-icon>
                                                  Cancelar
                                                </v-btn>
                                                <v-btn color="secondary" :loading="loading" :disabled="loading" @click="loader = 'loading'">
                                                  <v-icon>mdi-content-save</v-icon>
                                                  Guardar
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-col>
                            </v-row>
                            <v-dialog v-model="dialogPhoto" persistent max-width="500" transition="dialog-bottom-transition">
                                <v-card elevation="10">
                                    <v-card-title class="text-uppercase display-1 fondoTitulo">Subir Foto</v-card-title>
                                    <v-card-text>
                                        <div class="mx-1 my-5">
                                            <v-row>
                                                <v-col cols="12" sm="12" md="12" lg="12">
                                                    <v-file-input v-model="avatar" outlined show-size label="Avatar de Usuario" prepend-icon="" prepend-inner-icon="mdi-camera" counter small-chips></v-file-input>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="12" lg="12">
                                                    <v-card class="mx-auto" elevation="1" max-width="450">
                                                        <v-card-title class="text-uppercase fondoTitulo">Preview</v-card-title>
                                                        <v-card-text>
                                                            <div class="mx-1 my-1">
                                                                <v-img :src="urlPreview" max-width="400" />
                                                            </div>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </v-card-text>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="closeDialogPhoto">Cancelar</v-btn>
                                        <v-btn color="secondary" @click="uploadPhoto">Subir</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.name="{ item }">
                        <v-tooltip right color="transparent">
                            <template v-slot:activator="{ attrs, on }">
                                <span v-bind="attrs" v-on="on">{{ item.name }}</span>
                            </template>
                            <v-avatar :size="150">
                                <v-img :src="item.avatar" :lazy-src="item.avatar"></v-img>
                            </v-avatar>
                        </v-tooltip>
                    </template>
                    <template v-slot:item.status="{ item }">
                        <v-chip x-small dark :color="procesarStatus(item.status)" v-text="item.status ? 'ACTIVO' : 'INACTIVO'"></v-chip>
                    </template>
                    <template v-slot:item.online="{ item }">
                        <v-chip x-small dark :color="procesarStatus(item.online)" v-text="item.online ? 'ONLINE' : 'OFFLINE'"></v-chip>
                    </template>
                    <template v-slot:item.roles="{ item }">
                        <div v-for="rol in item.roles" :key="rol">
                        <v-chip x-small dark color="primary" class="mx-1" v-text="rol"></v-chip>
                        </div>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn fab dark x-small color="purple accent-2" @click="subirFoto(item)">
                            <v-icon>mdi-cloud-upload</v-icon>
                        </v-btn>
                        <v-btn fab dark x-small color="blue accent-2" class="mx-1" @click="verItem(item)">
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                        <v-btn fab dark x-small color="primary" @click="eliminarItem(item)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                        <v-btn fab dark x-small color="brown darken-1" class="mx-1" @click="forzarCierre(item)">
                            <v-icon>mdi-logout</v-icon>
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
            totalUsers: 0,
            totalUsersActive: 0,
            totalUsersOnline: 0,
            search: "",
            contador: 0,
            colorPage: "#D50000",
            dialogUser: false,
            dialogPhoto: false,
            groupBy: null,
            loading: false,
            loader: null,
            page: 1,
            pageCount: 0,
            itemsPerPage: 100,
            showPassword: false,
            headerTable: [
                { text: "Colaborador", value: "name", align: "center", sortable: true, groupable: false, class: "text-uppercase" },
                { text: "Usuario", value: "username", align: "center", sortable: false, groupable: false, class: "text-uppercase" },
                { text: "Online", value: "online", align: "center", sortable: false, groupable: true, class: "text-uppercase" },
                // { text: "Celular", value: "cellphone", align: "center", sortable: false, groupable: false, class: "text-uppercase" },
                { text: "Email", value: "email", align: "left", sortable: false, groupable: false, class: "text-uppercase" },
                { text: "Cargo", value: "roles", align: "center", sortable: false, groupable: false, class: "text-uppercase" },
                { text: "Estado", value: "status", align: "center", sortable: false, groupable: false, class: "text-uppercase" },
                { text: "Acciones", value: "actions", align: "center", sortable: false, groupable: false, width: 220, class: "text-uppercase" },
            ],
            contentTable: [],
            editedIndex: -1,
            editedItem: {
                name: "",
                username: "",
                password: "",
                email: "",
                cellphone: "",
                description: "",
                avatar: "",
                status: true,
                online: false,
                sucursal: "",
                marca: "",
                roles: [],
                createdBy: "",
            },
            defaultItem: {
                name: "",
                username: "",
                password: "",
                email: "",
                cellphone: "",
                description: "",
                avatar: "",
                status: true,
                online: false,
                marca: "",
                sucursal: "",
                roles: [],
                createdBy: "",
            },
            msg_nodata: "",
            //API Roles
            rolesSeleccionados: [],
            listaRoles: [],
            //API Sucursal
            sucursalSeleccionada: "",
            listaSucursales: [],
            // API MARCA
            marcaSeleccionada: [],
            listaMarcas: [],
            //Avatar
            avatar: null,
        };
    },

    computed: {
        ...mapState(["user"]),
        titleDialog() {
            return this.editedIndex === -1 ? "Nuevo usuario" : "Actualizar usuario";
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

        urlPreview() {
            if (!this.avatar) return;
            return URL.createObjectURL(this.avatar);
        },
    },

    watch: {
        dialogUser(val) {
            val || this.closeDialogUser();
        },

        dialogPhoto(val) {
            val || this.closeDialogPhoto();
        },

        loader(val){
          let a = this.loader;
            this[a] = !this[a];

            val &&
                setTimeout(() => {
                    this[a] = false;
                    // console.log("Empieza en 5 seg");
                }, 6000);

            val &&
                setTimeout(() => {
                    // console.log("Empieza en 1 seg");
                    this.guardarItem();
                }, 1000);

            this.loader = null;
        }
    },

    created() {
        this.detectarUsuario(this.userConectado);
        this.cargaBoxes();
        this.inicializar();
    },

    methods: {
        ...mapActions(["detectarUsuario"]),
        inicializar() {
            if (this.contentTable.length > 0) {
                pro.limpiarTabla(this.contentTable);
                this.cargarData();
                this.cargarContadores();
            } else {
                this.cargarData();
                this.cargarContadores();
            }
        },

        cargaBoxes() {
            this.getRolesActivos();
            this.getSucursalesActivas();
            this.getComboMarcasActivas();
        },

        cargarContadores() {
            this.getCounterUsersActive();
            this.getCounterUsersOnline();
        },

        contadorItems(pagination) {
            this.contador = pagination.itemsLength;
        },

        closeDialogUser() {
            this.dialogUser = false;
            this.$nextTick(() => {
                this.editedIndex = -1;
                this.editedItem = Object.assign({}, this.defaultItem);
                this.sucursalSeleccionada = "";
                this.marcaSeleccionada = [];
            });
        },

        closeDialogPhoto() {
            this.dialogPhoto = false;
            this.$nextTick(() => {
                this.editedIndex = -1;
                this.editedItem = Object.assign({}, this.defaultItem);
                this.avatar = null;
            });
        },

        async getCounterUsersActive() {
            try {
                const query = await axios.get("users/activos");
                if (query.status == 200) {
                    this.totalUsersActive = query.data.count_activos;
                }
            } catch (err) {
                pro.capturarError(err.response);
            }
        },

        async getCounterUsersOnline() {
            let param = {};
            param.online = true;
            try {
                const query = await axios.post("users/count/online", param);
                if (query.status == 200) {
                    this.totalUsersOnline = query.data.nro_users_online;
                }
            } catch (err) {
                pro.capturarError(err.response);
            }
        },

        async cargarData() {
            try {
                const query = await axios.get("users");
               //  console.log(query);
                if (query.status == 200) {
                    this.totalUsers = query.data.total_count;
                    await query.data.all_users.forEach((element) => {
                        let obj = {};
                        obj.codigo = element._id;
                        obj.avatar = element.avatar;
                        obj.name = element.name;
                        obj.username = element.username;
                        obj.cellphone = element.cellphone;
                        obj.email = element.email;
                        obj.marca = element.marca.map(a => a.name);
                        obj.sucursal = pro.validarVacios(element.sucursal) ? "" : element.sucursal.name;
                        obj.roles = pro.validarVacios(element.roles) ? [] : element.roles.map((a) => a.name);
                        obj.online = element.online;
                        obj.status = element.status;

                        this.contentTable.push(obj);
                    });
                }
            } catch (err) {
                this.msg_nodata = err.response.data.message;
                pro.capturarError(err.response);
            }
        },

        async getRolesActivos() {
            try {
                const query = await axios.get("roles/activos");
                if (query.status == 200) {
                    this.listaRoles = query.data.roles_activos;
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

        async getComboMarcasActivas() {
            try {
                const query = await axios.get("brands/activos");
                if (query.status == 200) {
                    this.listaMarcas = query.data.active_brands;
                }
            } catch (err) {
                pro.capturarError(err.response);
            }
        },

        procesarStatus(status) {
            if (status) return "green darken-2";
            else return "red darken-4";
        },

        verItem(item) {
          //   console.log(item);
            this.editedIndex = this.contentTable.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.rolesSeleccionados = this.editedItem.roles;
            this.sucursalSeleccionada = this.editedItem.sucursal;
            this.marcaSeleccionada = this.editedItem.marca;
            this.dialogUser = !this.dialogUser;
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
                        const query = await axios.delete("users/" + id);
                        if (query.status == 200) {
                            pro.alertaExitosa(query.data.message);
                            this.inicializar();
                        }
                    } catch (err) {
                        pro.capturarError(err.response);
                    }
                }
            });
        },

        async guardarItem() {
            if (this.editedIndex > -1) {
                // console.log("Editar item");
                let id = this.editedItem.codigo;
                this.editedItem.sucursal = this.sucursalSeleccionada;
                this.editedItem.roles = this.rolesSeleccionados;
                this.editedItem.marca = this.marcaSeleccionada;

                try {
                    const query = await axios.patch("users/" + id, this.editedItem);

                    if (query.status == 200) {
                        pro.alertaExitosa(query.data.message);
                        this.closeDialogUser();
                        this.inicializar();
                    }
                } catch (err) {
                    pro.capturarError(err.response);
                }
            } else {
                // console.log("Nuevo item");
                const employee = await axios.get("users/" + this.$store.state.user.userCod);

                let newObj = {
                    name: this.editedItem.name,
                    username: this.editedItem.username,
                    password: this.editedItem.password,
                    cellphone: this.editedItem.cellphone,
                    email: this.editedItem.email,
                    sucursal: this.sucursalSeleccionada,
                    roles: this.rolesSeleccionados,
                    marca: this.marcaSeleccionada,
                    createdBy: employee.data.founded.username,
                };

                if (this.validarCamposVacios(newObj)) {
                    try {
                        const query = await axios.post("users", newObj);
                        if (query.status == 200) {
                            pro.alertaExitosa(query.data.message);
                            this.closeDialogUser();
                            this.inicializar();
                        }
                    } catch (err) {
                        pro.capturarError(err.response);
                    }
                }
            }
        },

        validarCamposVacios(obj) {
            let msg = [];

            if (obj.name == "" || obj.name == null || obj.name == undefined) {
                msg.push("Colaborador");
            }
            if (obj.username == "" || obj.username == null || obj.username == undefined) {
                msg.push("Usuario");
            }
            if (obj.password == "" || obj.password == null || obj.password == undefined) {
                msg.push("Contraseña");
            }
            if (obj.sucursal == "" || obj.name == null || obj.name == undefined) {
                msg.push("Sucursal");
            }
            if (obj.roles == "" || obj.name == null || obj.name == undefined) {
                msg.push("Roles");
            }

            if (msg.length > 0) {
                pro.alertaCamposVacios(msg);
                return false;
            } else {
                return true;
            }
        },

        colorSucursal(item) {
            return pro.colorearSucursal(item);
        },

        obtenerSuc(item) {
            return pro.abreviaturaSucursal(item);
        },

        subirFoto(item) {
            this.editedIndex = this.contentTable.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.rolesSeleccionados = this.editedItem.roles;
            this.sucursalSeleccionada = this.editedItem.sucursal;
            this.dialogPhoto = !this.dialogPhoto;
        },

        async forzarCierre(item) {
            let obj = {
                username: item.username,
            };

            Swal.fire({
                icon: "question",
                title: "¿Estás seguro que desea forzar el cierre?",
                text: "No podrás revertir la acción",
                showCancelButton: true,
                confirmButtonText: "Si, cerrar sesión",
                confirmButtonColor: "#43A047",
                cancelButtonText: "Cancelar",
                cancelButtonColor: "#d33",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const query = await axios.post("auth/force-logout", obj);

                        if (query.status == 200) {
                            pro.alertaExitosa(query.data.message);
                            pro.limpiarTabla(this.contentTable);
                            await this.cargarData();
                            await this.cargarContadores();
                        }
                    } catch (err) {
                        pro.capturarError(err.response);
                    }
                }
            });
        },

        async uploadPhoto() {
            let id = this.editedItem.codigo;
            const formData = new FormData();
            formData.append("avatar", this.avatar);

            if (this.avatar == null || this.avatar == undefined) {
                pro.alertaCamposVacios("Cargue un avatar");
            } else {
                try {
                    const query = await axios.patch("users/upload/" + id, formData);
                    if (query.status == 200) {
                        pro.alertaExitosa(query.data.message);
                        this.closeDialogPhoto();
                    }
                } catch (err) {
                    pro.capturarError(err.response);
                }
            }
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
