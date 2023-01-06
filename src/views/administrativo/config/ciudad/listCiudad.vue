<template>
    <item-data
        :totalItem="totalStatus"
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
            totalStatus: 0,
            totalActive: 0,
            sortBy: 'name',
            headerTable: [
                {text: 'Ciudad', value: 'name', align: 'center', sortable: false, groupable: false,  class: "text-uppercase text-h5"},
                {text: 'Estado', value: 'status', align: 'center', sortable: false, groupable: false,  class: "text-uppercase text-h5"},
                {text: 'Creador', value: 'createdBy', align: 'center', sortable: false, groupable: false,  class: "text-uppercase text-h5"},
                {text: 'Acciones', value: 'actions', align: 'center', sortable: false, groupable: false,  class: "text-uppercase text-h5"},
            ],
            contentTable: [],
            rutaAxios: 'city'
        }
    },

    computed:{
        titleTable(){
            return 'Ciudad';
        }
    },

    created(){
        this.getTotalActiveCiudad();
    },

    methods: {
        async cargarData(){
            try {
                const query = await axios.get(this.rutaAxios);
                if(query.status == 200){
                    this.totalStatus = query.data.total;
                    await query.data.all_cities.forEach((element) => {
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

        async getTotalActiveCiudad(){
            try {
                const query = await axios.get(this.rutaAxios + '/activos');
                if(query.status == 200){
                    this.totalActive = query.data.active_total;
                }
            } catch (err) {
                pro.capturarError(err.response);
            }
        }
    }
}
</script>