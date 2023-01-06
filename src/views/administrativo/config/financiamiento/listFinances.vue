<template>
    <item-data
        :totalItem="totalFinanciamiento"
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
            totalFinanciamiento: 0,
            totalActive: 0,
            sortBy: 'name',
            headerTable: [
                {text: 'Financiamiento', value: 'name', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                {text: 'Estado', value: 'status', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                {text: 'Creador', value: 'createdBy', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                {text: 'Acciones', value: 'actions', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
            ],
            contentTable: [],
            rutaAxios: 'finances'
        }
    },

    computed: {
        titleTable(){
            return 'financiamiento';
        }
    },

    created(){
        this.getTotalActiveFinances();
    },

    methods: {
        async cargarData(){
            const query = await axios.get('finances');
            if(query.status == 200){
                this.totalFinanciamiento = query.data.total;
                await query.data.all_finances.forEach((element) => {
                    let obj = {};

                    obj.codigo = element._id;
                    obj.name = element.name;
                    obj.status = element.status;
                    obj.createdBy = element.createdBy.name;

                    this.contentTable.push(obj);
                });
            }
        },

        async getTotalActiveFinances(){
            try {
                const query = await axios.get('finances/activos');
                if(query.status == 200){
                    this.totalActive = query.data.total_active;
                }
            } catch (err) {
                pro.capturarError(err.response);
            }
        }
    }
}
</script>