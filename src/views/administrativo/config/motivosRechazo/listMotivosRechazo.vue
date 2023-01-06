<template>
	<item-data
        :totalItem="totalMotivos"
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
			totalMotivos: 0,
            totalActive: 0,
            sortBy: 'name',
			headerTable: [
                {text: 'Motivo', value: 'name', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                {text: 'Estado', value: 'status', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                {text: 'Creador', value: 'createdBy', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                {text: 'Acciones', value: 'actions', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
            ],
			contentTable: [],
            rutaAxios: 'motivo-rechazo',
		};
	},

    computed: {
        titleTable(){
            return 'Motivo de rechazo';
        }
    },

    created(){
        this.getTotalActiveBancos();
    },

    methods: {
        async cargarData(){
            try {
                const query = await axios.get(this.rutaAxios);
                if(query.status == 200){
                    this.totalMotivos = query.data.total;
                    await query.data.all.forEach((element) => {
                        let obj = {};
    
                        obj.codigo = element._id;
                        obj.name = element.name;
                        obj.status = element.status;
                        obj.createdBy = pro.validarVacios(element.createdBy) ? '' :  element.createdBy.name;
    
                        this.contentTable.push(obj);
                    });
                }
            } catch (err) {
                // console.log(err);
                pro.capturarError(err.response);
            }
        },

        async getTotalActiveBancos(){
            try {
                const query = await axios.get(this.rutaAxios + '/activos');
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
