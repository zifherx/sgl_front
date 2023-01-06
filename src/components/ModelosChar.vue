<template>
	<div>
		<highcharts :options="chartOptions" />
	</div>
</template>
<script>
export default {
	props: {
		tituloGrafico: String,
		ejeGrafico: Array,
		valoresGrafico: Array,
	},

	computed: {
		chartOptions() {
			return {
				chart: {
					type: "cylinder",
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					options3d: {
						enabled: true,
						alpha: 10,
						beta: 25,
						depth: 70,
					},
				},

				title: {
					text: this.tituloGrafico,
				},

				subtitle: {
					text: "Autonort Nor Oriente",
				},

				credits: {
					enabled: false,
				},

				legend: {
					enabled: false,
				},

				accessibility: {
					point: {
						valueSuffix: " und",
					},
				},

				plotOptions: {
					cylinder: {
						depth: 35,
						dataLabels: {
							enabled: false,
						},
					},
					series: {
						colorByPoint: true,
					},
				},

				series: [
					{
						name: "Vehículos",
						data: this.valoresGrafico,
						showInLegend: true,
					},
				],
			};
		},
	},
};
</script>
