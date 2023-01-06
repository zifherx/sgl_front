<template>
	<item-data
        :totalItem="totalBancos"
        :totalActive="totalActive"
        :titleSubmodule="titleTable"
        :rutaAxiosModule="rutaAxios"
        :headerTable="headerTable"
        :contentTable="contentTable"
        :cargarData="cargarData"
        :ordenarBy="sortBy"
    ></item-data>
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
			totalBancos: 0,
            totalActive: 0,
            sortBy: 'name',
			headerTable: [
                {text: 'Entidad Bancaria', value: 'name', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                {text: 'Estado', value: 'status', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                {text: 'Creador', value: 'createdBy', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                {text: 'Acciones', value: 'actions', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
            ],
			contentTable: [],
            rutaAxios: 'bancos',
		};
	},

    computed: {
        titleTable(){
            return 'banco';
        }
    },

    created(){
        this.getTotalActiveBancos();
    },

    methods: {
        async cargarData(){
            const query = await axios.get('bancos');
            if(query.status == 200){
                this.totalBancos = query.data.total;
                await query.data.entidades.forEach((element) => {
                    let obj = {};

                    obj.codigo = element._id;
                    obj.avatar = element.avatar;
                    obj.name = element.name;
                    obj.status = element.status;
                    obj.createdBy = element.createdBy.name;

                    this.contentTable.push(obj);
                });
            }
        },

        async getTotalActiveBancos(){
            try {
                const query = await axios.get('bancos/activos');
                if(query.status == 200){
                    this.totalActive = query.data.total;
                }
            } catch (err) {
                // console.log(err);
                // console.log(err.response);
                pro.capturarError(err.response);
            }
        }
    }
};
</script>
