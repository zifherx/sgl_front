<template>
	<div class="mx-5 my-5">
		<v-row>
			<v-col cols="12" sm="6" md="6" lg="6">
				<v-card outlined max-width="600" class="mx-auto" elevation="2">
					<v-img :src="urlImages[0].src" :lazy-src="urlImages[0].src" height="300" contain class="white--text align-end prueba">
						<v-card-title class="text-h3 font-weight-bold titulo"> Toyota </v-card-title>
					</v-img>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn class="ml-5" dark color="info" @click="irVistaDashboardToyota">
							<v-icon left>mdi-car-side</v-icon>
							Ver Leads
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
			<v-col cols="12" sm="6" md="6" lg="6">
				<v-card outlined max-width="600" class="mx-auto" elevation="2">
					<v-img :src="urlImages[1].src" :lazy-src="urlImages[1].src" height="300" class="white--text align-end prueba">
						<v-card-title class="text-h3 font-weight-bold titulo"> Hino </v-card-title>
					</v-img>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn class="ml-5" dark color="info" @click="irVistaDashboardHino">
							<v-icon left>mdi-truck</v-icon>
							 Ver Leads
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</div>
</template>
<script>
export default {
	data(){
		return{
			urlImages: [
				{src: 'https://cdn.pixabay.com/photo/2016/08/15/18/19/toyota-1596082_960_720.png'},
				{src: 'https://www.hinoperu.com.pe/sites/default/files/2021-09/Soporte-total%20desktop.jpg'},
			]
		}
	},

	methods:{
		irVistaDashboardToyota(){
			this.$router.push('/dashboard/toyota');
		},

		irVistaDashboardHino(){
			this.$router.push('/dashboard/hino');
		}
	}
}
</script>
<style>
.prueba {
    opacity: 0.9;
}

.titulo {
    background-color: #000;
    opacity: 0.8;
}
</style>