<template>
  <v-app>
      <router-view/>
      <footer-page :versionNumber="version"/>
  </v-app>
</template>

<script>
import FooterPage from './components/FooterPage';
export default {
  name: 'App',

  components:{
    FooterPage
  },

  data(){
    return{
      version: '1.6.0'
    }
  },

};
</script>
