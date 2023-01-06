<template>
    <v-footer dark color="primary">
        <v-container>
            <v-row align="center" no-gutters>
                <v-spacer class="hidden-sm-and-down"></v-spacer>
                <v-col cols="12" class="mx-auto">
                    <div class="body-1 font-weight-light pt-md-0 text-center">Sistema SGL v{{versionNumber}} &copy; - {{ new Date().getFullYear() }}</div>
                </v-col>
            </v-row>
        </v-container>
    </v-footer>
</template>
<script>
export default {
    name: 'FooterPage',

    props:{
        versionNumber: String
    }
}
</script>