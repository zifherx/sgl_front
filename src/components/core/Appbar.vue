<template>
	<v-app-bar app color="transparent" absolute flat height="75">
		<v-btn class="mr-3" elevation="1" fab color="primary" small @click.stop="setDrawer(!drawer)">
			<v-icon>{{ drawer ? "mdi-menu" : "mdi-dots-vertical" }}</v-icon>
		</v-btn>
		<v-toolbar-title
			class="hidden-sm-and-down primary--text font-weight-bold"
			v-text="$route.name"
		></v-toolbar-title>

        <v-spacer></v-spacer>
        <v-tooltip bottom color="primary">
            <template v-slot:activator="{attrs,on}">
                <v-btn color="black" text v-bind="attrs" v-on="on" @click="irDashboard">
                    <v-icon >mdi-view-dashboard</v-icon>
                </v-btn>
            </template>
            <span>Dashboard</span>
        </v-tooltip>
        <v-tooltip bottom color="primary">
            <template v-slot:activator="{attrs,on}">
                <v-btn color="black" text v-bind="attrs" v-on="on" @click="irPerfil">
                    <v-icon >mdi-account</v-icon>
                </v-btn>
            </template>
            <span>Perfil</span>
        </v-tooltip>
        <v-tooltip bottom color="primary">
            <template v-slot:activator="{attrs,on}">
                <v-btn color="black" text v-bind="attrs" v-on="on" @click="logOut">
                    <v-icon >mdi-logout</v-icon>
                </v-btn>
            </template>
            <span>Cerrar Sesión</span>
        </v-tooltip>
	</v-app-bar>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
import Swal from 'sweetalert2';

export default {
	name: "DashboardCoreAppBar",

	data() {
		return {};
	},

	computed: {
		...mapState(["drawer"]),
	},

	methods: {
		...mapMutations({ setDrawer: "SET_DRAWER" }),
        ...mapActions(['cerrarSesion']),

        irDashboard(){
            this.$router.push('/dashboard')
            .catch(error => {
                if(error.name !== 'NavigationDuplicated') throw error;
            })
        },

        irPerfil(){
            this.$router.push('/profile')
            .catch(error => {
                if(error.name !== 'NavigationDuplicated') throw error;
            })
        },

        logOut(){
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 2500,
                didOpen: a => {
                    a.addEventListener("mouseenter", Swal.stopTimer);
                    a.addEventListener("mouseleave", Swal.resumeTimer);
                }
            });

            Toast.fire({
                icon: 'success',
                title: '¡Cerrando sesión!'
            })
            .then(result => {
                if(result.dismiss === Swal.DismissReason.timer){
                    this.cerrarSesion();
                }
            })
        }
	},
};
</script>
