<template>
	<div>
		<item-data
			:totalItem="totalChasis"
			:totalActive="totalActive"
			:titleSubmodule="titleTable"
			:rutaAxiosModule="rutaAxios"
			:headerTable="headerTable"
			:contentTable="contentTable"
			:cargarData="cargarData"
			:ordenarBy="sortBy"
		></item-data>
	</div>
</template>
<script>
import ItemData from "../../../../components/ItemData";
import * as pro from "../../../../plugins/helper";

export default {
	components: {
		ItemData,
	},

	data() {
		return {
			totalChasis: 0,
			totalActive: 0,
			sortBy: "name",
			headerTable: [
				{
					text: "Tipo",
					value: "name",
					align: "center",
					sortable: false,
					groupable: false,
					class: "text-uppercase text-h5",
				},
				{
					text: "Estado",
					value: "status",
					align: "center",
					sortable: false,
					groupable: false,
					class: "text-uppercase text-h5",
				},
				{
					text: "Creador",
					value: "createdBy",
					align: "center",
					sortable: false,
					groupable: false,
					class: "text-uppercase text-h5",
				},
				{
					text: "Acciones",
					value: "actions",
					align: "center",
					sortable: false,
					groupable: false,
					class: "text-uppercase text-h5",
				},
			],
			contentTable: [],
			rutaAxios: "chasis",
		};
	},

	computed: {
		titleTable() {
			return "chasis";
		},
	},

	created() {
		this.getTotalActiveChasis();
	},

	methods: {
		async cargarData() {
			try {
				const query = await axios.get("chasis");
				if (query.status == 200) {
					this.totalChasis = query.data.total;
					await query.data.all_chasis.forEach((element) => {
						let obj = {};

						obj.codigo = element._id;
						obj.name = element.name;
						obj.status = element.status;
						obj.createdBy = pro.validarVacios(element.createdBy) ? '-' : element.createdBy.name;

						this.contentTable.push(obj);
					});
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},

		async getTotalActiveChasis() {
			try {
				const query = await axios.get("chasis/activos");
				if (query.status == 200) {
					this.totalActive = query.data.total;
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},
	},
};
</script>
