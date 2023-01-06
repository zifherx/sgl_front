<template>
  <v-main>
    <nav-bar/>
    <!-- <v-main> -->
      <principal-page/>
    <!-- </v-main> -->
  </v-main>
</template>

<script>
import NavBar from '../components/Navbar';
import PrincipalPage from '../components/PrincipalPage';
  export default {
    name: 'Home',

    components: {
      NavBar,
      PrincipalPage
    },
  }
</script>
<style>
.borde2{
  border: 1px solid pink;
}
</style>