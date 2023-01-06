<template>
    <div class="mx-5 my-5">
        <v-row>
            <v-col v-if="$vuetify.breakpoint.xs ? false : true || $vuetify.breakpoint.sm ? true : false || $vuetify.breakpoint.md ? true : false || $vuetify.breakpoint.lg ? true : false " cols="12" sm="8" md="8" lg="8">
                <carrusel-portada :images="slides"/>
            </v-col>
            <v-col cols="12" sm="4" md="4" lg="4" class="my-auto">
                <login-portada/>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import CarruselPortada from './CarruselPortada';
import LoginPortada from './LoginPortada';

export default {
    components:{
        CarruselPortada,
        LoginPortada
    },

    data(){
        return{
            slides: [
				{ src: "https://autonortnor.com.pe/upload/4f7qf1pppzx7eaph.jpg" },
				{ src: "https://autonortnor.com.pe/upload/fvapzhikt5tsl5si.png" },
				{ src: "https://autonortnor.com.pe/upload/a83xavtujsgdmjp1.png" },
				{ src: "https://www.toyotaperu.com.pe/sites/default/files/corolla-exterior-azul.jpg" },
				{ src: "https://www.toyotaperu.com.pe/sites/default/files/prius-galeria_0002_PRIU1810-1001.jpg" }
            ]
        }
    }
}
</script>