<template>
    <v-app>
        <dashboard-core-app-bar/>
        <dashboard-core-drawer/>
        <dashboard-core-view/>
    </v-app>
</template>
<script>
import axios from 'axios';
import { mapActions, mapState } from 'vuex';
export default {
    components:{
        DashboardCoreAppBar: () => import('../../components/core/Appbar'),
        DashboardCoreDrawer: () => import('../../components/core/Drawer'),
        DashboardCoreView: () => import('../../components/core/View'),
    },

    computed: {
        ...mapState(['user'])
    },

    created(){
        this.detectarUsuario(this.user);
        this.inicializar();
    },

    methods:{
        ...mapActions(['detectarUsuario']),

        inicializar(){
            this.asignarTokenAxios();
        },

        asignarTokenAxios(){
            const tokenStorage = localStorage.getItem('data-token');
            if(this.user == null || this.user == undefined || this.user == ''){
                // console.log('TokenStorage:',tokenStorage);
                axios.defaults.headers.common['x-access-token'] = tokenStorage;
            }else{
                // console.log('Token Vuex:',this.user.token);
                axios.defaults.headers.common['x-access-token'] = this.user.token;
            }
        }
    }
}
</script>
<style>
body {
    background-color: '#ECECEC';
}
</style>