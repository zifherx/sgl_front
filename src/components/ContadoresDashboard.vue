<template>
    <div>
        <v-row class="mt-5">
            <v-col cols="12" sm="12" md="12" lg="6">
                <base-material-stats-card v-model="totalSolicitudes" color="blue darken-4" icon="mdi-tag" value="0" subIcon="mdi-tag" subText="100%" subIconColor="primary" title="Solicitudes"></base-material-stats-card>
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="6">
                <base-material-stats-card v-model="totalAsignadas" color="light-green lighten-1" icon="mdi-account-circle" value="0" subIcon="mdi-account-circle" :subText="percentAsignadas" subIconColor="primary" title="Asignadas"></base-material-stats-card>
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="6">
                <base-material-stats-card v-model="totalBooking" color="orange darken-2" icon="mdi-briefcase-variant" value="0"  subIcon="mdi-briefcase-variant" :subText="percentBooking" subIconColor="primary" title="Booking"></base-material-stats-card>
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="6">
                <base-material-stats-card v-model="totalVentas" color="green darken-2" icon="mdi-basket" value="0" subIcon="mdi-basket" :subText="percentVentas" subIconColor="primary" title="Ventas"></base-material-stats-card>
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="12">
                <base-material-stats-card v-model="closingRate" color="red lighten-1" icon="mdi-percent" value="0" smallValue="%" title="Closing Rate"></base-material-stats-card>
            </v-col>
        </v-row>
    </div>
</template>
<script>
export default {
    props:{
        totalSolicitudes: Number,
        totalAsignadas: Number,
        totalBooking: Number,
        totalVentas: Number,
        closingRate: Number,
        //Percentages
        percentAsignadas: String,
        percentBooking: String,
        percentVentas: String
    }
}
</script>