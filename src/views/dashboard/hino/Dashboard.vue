<template>
    <div class="mx-5 my-5">
        <dashboard-core
            :titlePage="titlePrimary"
            :totalSolicitudes="totalSolicitudes"
            :totalAsignadas="totalAsignadas"
            :totalBooking="totalBooking"
            :totalVentas="totalVentas"
            :closingRate="closingRate"
            :totalPercentAsingada="totalPercentAsingada"
            :totalPercentBooking="totalPercentBooking"
            :totalPercentVentas="totalPercentVentas"
            :tituloGrafico ="titleFunnel"
            :contentArray="dataLeads"
            @escucharHijo="variableHijo"
            :getData="getData"
        />
    </div>
</template>
<script>
import * as pro from '../../../plugins/helper';
import DashboardCore from "../../../components/layouts/DashboardCore";

export default {
    components: {
        DashboardCore,
    },

    data() {
        return {
            titlePrimary: "Hino",
            //Contadores
            totalSolicitudes: 0,
            totalAsignadas: 0,
            totalBooking: 0,
            totalVentas: 0,
            // Piramide
            titleFunnel: 'Seguimiento de Leads'
        };
    },

    computed: {
        closingRate() {
            let rate = (this.totalVentas / this.totalSolicitudes) * 100;
            if (this.totalSolicitudes === 0) {
                return 0;
            } else {
                return pro.round10(rate, -2);
            }
        },

        totalPercentAsingada() {
            let valor = pro.round10((this.totalAsignadas / this.totalSolicitudes) * 100, -2);

            if (this.totalSolicitudes === 0) {
                return 0 + "%";
            } else {
                return valor + " %";
            }
        },

        totalPercentBooking() {
            let valor = pro.round10((this.totalBooking / this.totalAsignadas) * 100, -2);
            if (this.totalSolicitudes === 0) {
                return 0 + "%";
            } else {
                return valor + " %";
            }
        },

        totalPercentVentas() {
            let valor = pro.round10((this.totalVentas / this.totalBooking) * 100, -2);
            if (this.totalSolicitudes === 0) {
                return 0 + "%";
            } else {
                return valor + " %";
            }
        },

        dataLeads() {
			return [
				{ name: "Solicitudes", y: this.totalSolicitudes },
				{ name: "Asignadas", y: this.totalAsignadas },
				{ name: "Booking", y: this.totalBooking },
				{ name: "Ventas", y: this.totalVentas },
			];
		},
    },

    methods:{
        variableHijo(value) {
            // console.log(value);
            this.variableRecibida = value;
        },

        getData(){
            this.obtenerLeadsGenerales();
			this.obtenerLeadsAsingados();
			this.obtenerLeadsBooking();
			this.obtenerLeadsVentas();
        },

        async obtenerLeadsGenerales() {
			let param = {
                marca: 'HINO',
				estado: "",
				start: this.variableRecibida.rangoFechas[0],
				end: this.variableRecibida.rangoFechas[1],
			};

			try {
				const query = await axios.post("leads/count/by-dates", param);
				if (pro.askHttp200(query.status)) {
					this.totalSolicitudes = query.data.qty;
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		async obtenerLeadsAsingados() {
			let param = {
                marca: 'HINO',
				estado: "ASIGNADO",
				start: this.variableRecibida.rangoFechas[0],
				end: this.variableRecibida.rangoFechas[1],
			};

			try {
				const query = await axios.post("leads/count/by-dates", param);
				if (pro.askHttp200(query.status)) {
					this.totalAsignadas = query.data.qty;
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		async obtenerLeadsBooking() {
			let param = {
                marca: 'HINO',
				isBooking: true,
                isVenta: false,
				start: this.variableRecibida.rangoFechas[0],
				end: this.variableRecibida.rangoFechas[1],
			};

			try {
				const query = await axios.post("leads/conversion/count-by-dates", param);
                // console.log('Hino Booking', query);
				if (pro.askHttp200(query.status)) {
					this.totalBooking = query.data.qty;
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		async obtenerLeadsVentas() {
			let param = {
                marca: 'HINO',
				isBooking: true,
				isVenta: true,
				start: this.variableRecibida.rangoFechas[0],
				end: this.variableRecibida.rangoFechas[1],
			};

			try {
				const query = await axios.post("leads/conversion/count-by-dates", param);
				if (pro.askHttp200(query.status)) {
					this.totalVentas = query.data.qty;
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},
    }
};
</script>
