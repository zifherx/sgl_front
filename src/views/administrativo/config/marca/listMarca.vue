<template>
    <item-data
        :totalItem="totalMarcas"
        :totalActive="totalActive"
        :titleSubmodule="titleTable"
        :rutaAxiosModule="rutaAxios"
        :headerTable="headerTable"
        :contentTable="contentTable"
        :cargarData="cargarData"
        :ordenarBy="sortBy"
    />
</template>
<script>
import ItemData from '../../../../components/ItemData';
import * as pro from '../../../../plugins/helper';

export default {
    components: {
        ItemData
    },

    data(){
        return{
            totalMarcas: 0,
            totalActive: 0,
            sortBy: 'name',
            headerTable: [
                {text: 'Marca', value: 'name', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                {text: 'Estado', value: 'status', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                {text: 'Creador', value: 'createdBy', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                {text: 'Acciones', value: 'actions', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
            ],
            contentTable: [],
            rutaAxios: 'brands'
        }
    },

    computed: {
        titleTable(){
            return 'marca';
        }
    },

    created(){
        this.getTotalActiveMarcas();
    },

    methods: {
        async cargarData(){
            try {
                const query = await axios.get(this.rutaAxios);
                if(query.status == 200){
                    this.totalMarcas = query.data.total_brands;
                    await query.data.all_brands.forEach((element) => {
                        let obj = {};
    
                        obj.codigo = element._id;
                        obj.avatar = element.avatar;
                        obj.name = element.name;
                        obj.status = element.status;
                        obj.createdBy = element.createdBy.name;
    
                        this.contentTable.push(obj);
                    });
                }
            } catch (err) {
                pro.capturarError(err.response);
            }
        },

        async getTotalActiveMarcas(){
            try {
                const query = await axios.get(this.rutaAxios + '/activos');
                if(query.status == 200){
                    this.totalActive = query.data.total_actives;
                }
            } catch (err) {
                pro.capturarError(err.response);
            }
        }
    }
}
</script>