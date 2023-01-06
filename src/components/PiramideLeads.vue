<template>
	<div>
		<highcharts :options="chartOptions" />
	</div>
</template>
<script>
export default {
	props: {
		tituloGrafico: String,
		contentArray: Array,
	},

	computed: {
		chartOptions() {
			return {
				chart: {
					type: "funnel3d",
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					options3d: {
						enabled: true,
						alpha: 5,
						depth: 50,
						viewDistance: 60,
					},
				},

				navigator: {
					adaptToUpdatedData: false,
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

				tooltip: {
					pointFormat: '<span style="color:{point.color}">\u25CF</span> <b>{series.name}</b>: <b>{point.y:,.0f}</b>',
				},

				plotOptions: {
					series: {
						colorByPoint: true,
						dataLabels: {
							enabled: true,
							format: "<span>{point.name}: <b>{point.y:,.0f}</b></span>",
							allowOverlap: true,
							y: -5,
							x: 15,
						},
						neckWidth: "30%",
						neckHeight: "-10%",
						width: "80%",
						height: "90%",
					},
				},

				legend: {
					enabled: true,
				},

				accessibility: {
					point: {
						valueSuffix: " leads",
					},
				},

				series: [
					{
						name: "Leads",
						data: this.contentArray,
					},
				],
			};
		},
	},
};
</script>
