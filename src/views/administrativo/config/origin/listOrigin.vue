<template>
    <item-data
        :totalItem="totalOrigin"
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
    components:{
        ItemData
    },
   
        data(){
        return{
            totalOrigin: 0,
            totalActive: 0,
            sortBy: 'name',
            headerTable: [
                {text: 'Origen', value: 'name', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                {text: 'Estado', value: 'status', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                {text: 'Creador', value: 'createdBy', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
                {text: 'Acciones', value: 'actions', align:'center', sortable: false, groupable: false, class: "text-uppercase text-h5"},
            ],
            contentTable: [],
            rutaAxios: 'origin'
        }
    },

    computed:{
        titleTable(){
            return 'Origen'
        }
    },

    created(){
        this.getTotalActiveOrigin();
    },

    methods:{
        async cargarData(){
            try {
                const query = await axios.get('origin');
                if(query.status == 200){
                    this.totalOrigin = query.data.total;
                    await query.data.all_origins.forEach((element) => {
                        let obj = {};

                        obj.codigo = element._id;
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

        async getTotalActiveOrigin(){
            try {
                const query = await axios.get('origin/activos');
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