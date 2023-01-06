<template>
    <div>
        <v-carousel cycle hide-delimiter-background show-arrows-on-hover hide-delimiters interval="10000" height="550">
            <v-carousel-item v-for="(item, i) in images" :key="i" :src="item.src" reverse-transition="fade-transition" transition="fade-transition">
            </v-carousel-item>
        </v-carousel>
    </div>
</template>
<script>
export default {
    props:{
        images: Array
    },

    data(){
        return{
            slides: []
        }
    }
}
</script>