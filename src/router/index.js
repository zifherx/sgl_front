import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "about" */ '../views/Error404.vue')
  },
  {
    path: '/dashboard',
    component: () => import ('../views/dashboard/Index'),
    meta: {
      isAuthenticated: true
    },
    children: [
      // Dashboard
      {
        name: 'Dashboard',
        path: '',
        component: () => import ('../views/dashboard/Dashboard')
      },
      // Dashboard Toyota
      {
        name: 'Dashboard Toyota',
        path: '/dashboard/toyota',
        component: () => import ('../views/dashboard/toyota/Dashboard')
      },
      // Dashboard Hino
      {
        name: 'Dashboard Hino',
        path: '/dashboard/hino',
        component: () => import ('../views/dashboard/hino/Dashboard')
      },
      // Roles o Permisos
      {
        name: 'Permisos',
        path: '/administrative/roles',
        component: () => import ('../views/administrativo/roles/listRoles')
      },
      // Usuarios
      {
        name: 'Usuarios',
        path: '/administrative/users',
        component: () => import ('../views/administrativo/users/listUsers')
      },
      // Vehículos
      {
        name: 'Vehículos',
        path: '/administrative/vehicles',
        component: () => import ('../views/administrativo/vehicles/listVehicles')
      },
      // Vendedores
      {
        name: 'Vendedores',
        path: '/administrative/sellers',
        component: () => import ('../views/administrativo/sellers/listSellers')
      },
      // Settings
      {
        name: 'Settings',
        path: '/administrative/settings',
        component: () => import ('../views/administrativo/config/dashboard')
      },
      // Submodulos
      {
        name: 'Banco',
        path: '/administrative/settings/bank',
        component: () => import ('../views/administrativo/config/banco/listBancos')
      },
      {
        name: 'Chasis',
        path: '/administrative/settings/chasis',
        component: () => import ('../views/administrativo/config/chasis/listChasis')
      },
      {
        name: 'Sucursal',
        path: '/administrative/settings/sucursal',
        component: () => import ('../views/administrativo/config/sucursal/listSucursal')
      },
      {
        name: 'Origen de Datos',
        path: '/administrative/settings/social-origin',
        component: () => import ('../views/administrativo/config/origin/listOrigin')
      },
      {
        name: 'Financiamiento',
        path: '/administrative/settings/finances',
        component: () => import ('../views/administrativo/config/financiamiento/listFinances')
      },
      {
        name: 'Estados',
        path: '/administrative/settings/status',
        component: () => import ('../views/administrativo/config/estado/listEstado')
      },
      {
        name: 'Conversion',
        path: '/administrative/settings/shift',
        component: () => import ('../views/administrativo/config/shift/listShift')
      },
      {
        name: 'Marca',
        path: '/administrative/settings/brand',
        component: () => import ('../views/administrativo/config/marca/listMarca')
      },
      {
        name: 'Modelo',
        path: '/administrative/settings/model',
        component: () => import ('../views/administrativo/config/modelo/listModelo')
      },
      {
        name: 'Motivos de Rechazo',
        path: '/administrative/settings/motivo-rechazo',
        component: () => import ('../views/administrativo/config/motivosRechazo/listMotivosRechazo')
      },
      {
        name: 'Ciudad',
        path: '/administrative/settings/city',
        component: () => import ('../views/administrativo/config/ciudad/listCiudad')
      },
      //Leads
      {
        name: 'Importación de Clientes',
        path: '/leads/import-data',
        component: () => import ('../views/leads/import/importData')
      },
      {
        name: 'Nuevo Lead',
        path: '/leads/new',
        component: () => import ('../views/leads/newLead')
      },
      {
        name: 'Ver Lead',
        path: '/leads/view/:leadId',
        component: () => import ('../views/leads/viewLead')
      },
      {
        name: 'Lista Leads',
        path: '/leads/list',
        component: () => import ('../views/leads/listLead')
      },
      {
        name: 'Histórico de Leads',
        path: '/leads/historical',
        component: () => import ('../views/leads/historicalLead')
      },
      {
        name: 'Leads Modificados x Día',
        path: '/leads/modificacion',
        component: () => import ('../views/leads/listModificados')
      },
      {
        name: 'Conversión de Leads',
        path: '/leads/shift',
        component: () => import ('../views/leads/conversion/listConversionLeads')
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  let autorizacion = to.matched.some(a => a.meta.isAuthenticated);
  let logueado = localStorage.getItem('data-token');

  if(autorizacion && !logueado){
    next({name: 'Home'});
  }else if(!autorizacion && logueado){
    next('dashboard');
  }else{
    next();
  }
});

export default router
