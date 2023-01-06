<template>
	<div>
		<highcharts :options="chartOptions" />
	</div>
</template>
<script>
export default {
	props: {
		tituloGrafico: String,
		dataGrafico: Array,
	},

	computed: {
		chartOptions() {
			return {
				chart: {
					type: "pie",
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					options3d: {
						enabled: true,
						alpha: 45,
						beta: 0,
					},
				},

				title: {
					text: this.tituloGrafico,
				},

				subtitle: {
					text: "Autonort Nor Oriente",
				},

				tooltip: {
					headerFormat: '<span style="font-size:9px">{series.name}</span><br/>',
					pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>',
				},

				accessibility: {
					point: {
						valueSuffix: " %",
					},
				},

				credits: {
					enabled: false,
				},

				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: "pointer",
						depth: 50,
						dataLabels: {
							enabled: true,
							format: "<b>{point.name}</b>: {point.percentage:.1f} %",
							connectorColor: "silver",
							shape: "square",
						},
						showInLegend: true,
					},
				},

				series: [
					{
						type: "pie",
						colorByPoint: true,
						name: "Leads",
						data: this.dataGrafico,
					},
				],
			};
		},
	},
};
</script>
