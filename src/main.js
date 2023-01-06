import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import {Global} from './Global';
import HighchartsVue from "highcharts-vue";
import Highcharts from 'highcharts';
import accessibility from 'highcharts/modules/accessibility';
import exportingInit from "highcharts/modules/exporting";
import loadDrillDown from 'highcharts/modules/drilldown';
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from 'highcharts/modules/solid-gauge';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display'
import Highcharts3d from "highcharts/highcharts-3d";
import HighchartsCylinder from "highcharts/modules/cylinder";
import highchartsFunnel3d from 'highcharts/modules/funnel3d';
import Vidle from 'v-idle'
import vuetify from './plugins/vuetify'
import './plugins/base'

Vue.use(Vidle);

accessibility(Highcharts);
exportingInit(Highcharts);
loadDrillDown(Highcharts)
highchartsMore(Highcharts);
solidGauge(Highcharts);
NoDataToDisplay(Highcharts);
Highcharts3d(Highcharts);
HighchartsCylinder(Highcharts);
highchartsFunnel3d(Highcharts);
Vue.use(HighchartsVue, { Highcharts });

window.Bus = new Vue;
window.axios = axios;

// window.token = localStorage.getItem('data-token');x
// window.user = localStorage.getItem('data-user');

// const token = localStorage.getItem('data-token');

// axios.defaults.baseURL = 'http://localhost:4000/api/';
axios.defaults.baseURL = Global.urlPublic;
// axios.defaults.headers.common['x-access-token'] = token;
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
