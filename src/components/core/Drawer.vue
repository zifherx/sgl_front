<template>
	<v-navigation-drawer
		id="core-navigation-drawer"
		v-model="drawer"
		:expand-on-hover="expandOnHover"
		app
		dark
		color="black"
		width="300"
		mobile-breakpoint="960"
	>
		<v-list dense nav class="my-5">
			<v-list-item>
				<v-img src="@/assets/logo-autonort-white.png" max-width="200" class="mx-auto"></v-img>
			</v-list-item>
		</v-list>

		<v-divider class="mb-1"></v-divider>

		<v-list dense nav>
			<v-list-item>
				<v-list-item-avatar size="70">
					<v-img :src="online.avatar" :lazy-src="online.avatar"></v-img>
				</v-list-item-avatar>
				<v-list-item-content>
					<v-list-item-title class="text-h6" v-text="online.name"></v-list-item-title>
					<v-list-item-subtitle class="mt-1" v-text="online.role"></v-list-item-subtitle>
					<v-list-item-subtitle v-text="online.email"></v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
		</v-list>

		<v-divider class="mb-1"></v-divider>

		<v-list dense nav>
			<v-list-group active-class="white--text" no-action prepend-icon="mdi-view-dashboard">
				<template v-slot:activator>
					<v-list-item-title>Dashboard</v-list-item-title>
				</template>
				<v-list-item v-for="(item, i) in dashboardItems" :key="i" link :to="rutaPrefixDashboard + item.to" active-class="white--text">
					<v-list-item-icon>
						<v-icon left v-text="item.icon"></v-icon>
					</v-list-item-icon>
					<v-list-item-title v-text="item.title"></v-list-item-title>
				</v-list-item>
			</v-list-group>
			
			<!-- <v-list-item link to="/dashboard">
				<v-list-item-icon>
					<v-icon>mdi-view-dashboard</v-icon>
				</v-list-item-icon>
				<v-list-item-title>Dashboard</v-list-item-title>
			</v-list-item> -->

			<v-list-group active-class="white--text" no-action prepend-icon="mdi-cog" v-if="online.role == 'Administrador'">
				<template v-slot:activator>
					<v-list-item-title>Administración</v-list-item-title>
				</template>
				<v-list-item v-for="(item, i) in adminItems" :key="i" link :to="rutaPrefixAdmin + item.to" active-class="white--text">
					<v-list-item-icon>
						<v-icon left v-text="item.icon"></v-icon>
					</v-list-item-icon>
					<v-list-item-title v-text="item.title"></v-list-item-title>
				</v-list-item>
			</v-list-group>

			<v-list-group active-class="white--text" no-action prepend-icon="mdi-bullhorn">
				<template v-slot:activator>
					<v-list-item-title>Leads</v-list-item-title>
				</template>
				<v-list-item v-for="(item, i) in leadsItems" :key="i" link :to="rutaPrefixLeads + item.to" active-class="white--text">
					<v-list-item-icon>
						<v-icon left v-text="item.icon"></v-icon>
					</v-list-item-icon>
					<v-list-item-title v-text="item.title"></v-list-item-title>
				</v-list-item>
			</v-list-group>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
import { mapActions, mapState } from "vuex";
import * as pro from "../../plugins/helper";

export default {
	name: "DashboardCoreDrawer",

	props: {
		expandOnHover: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			userLogueado: {
				name: "",
				role: "",
				avatar: "",
				email: "",
			},
			// Dashboard
			rutaPrefixDashboard: '/dashboard',
			dashboardItems: [
				{ title: 'Toyota', icon: 'mdi-car-side' , to: '/toyota'},
				{ title: 'Hino', icon: 'mdi-truck-flatbed' , to: '/hino'}
			],
			// Administrador
			rutaPrefixAdmin: "/administrative",
			adminItems: [
				{ title: "Configuraciones", icon: "mdi-folder-cog", to: "/settings" },
				{ title: "Permisos", icon: "mdi-tag", to: "/roles" },
				{ title: "Usuarios", icon: "mdi-account-cog", to: "/users" },
				{ title: "Vehículos", icon: "mdi-car", to: "/vehicles" },
				{ title: "Vendedores", icon: "mdi-account-box", to: "/sellers" },
			],
			//Leads
			rutaPrefixLeads: '/leads',
			leadsItems: [
				{ title: 'Importación Masiva', icon: 'mdi-database-import', to: '/import-data'},
				{ title: 'Nuevo Lead', icon: 'mdi-flag-plus', to: '/new'},
				{ title: 'Lista Leads', icon: 'mdi-table-cog', to: '/list'},
				{ title: 'Histórico de Leads', icon: 'mdi-table-large', to: '/historical'},
				{ title: 'Modificados', icon: 'mdi-alert-decagram', to: '/modificacion'},
				{ title: 'Seguimiento de Leads', icon: 'mdi-swap-horizontal', to: '/shift'},
			]
		};
	},

	computed: {
		...mapState(["user"]),

		drawer: {
			get() {
				return this.$store.state.drawer;
			},
			set(val) {
				this.$store.commit("SET_DRAWER", val);
			},
		},

		online() {
			return {
				name: this.userLogueado.name,
				role: this.userLogueado.role,
				avatar: this.userLogueado.avatar,
				email: this.userLogueado.email,
			};
		},
	},

	created() {
		this.detectarUsuario(this.user);
		this.obtenerUsuario();
	},

	methods: {
		...mapActions(["detectarUsuario"]),

		async obtenerUsuario() {
			let porlas = localStorage.getItem("data-user");
			let query = null;

			try {
				if (this.user == null || this.user == undefined || this.user == "") {
					query = await axios.get("users/" + porlas);
					this.userLogueado.name = query.data.founded.name;
					this.userLogueado.avatar = query.data.founded.avatar;
					this.userLogueado.role = query.data.founded.roles[0].name;
					this.userLogueado.email = query.data.founded.email;
				} else {
					query = await axios.get("users/" + this.user.userCod);
					this.userLogueado.name = query.data.founded.name;
					this.userLogueado.avatar = query.data.founded.avatar;
					this.userLogueado.role = query.data.founded.roles[0].name;
					this.userLogueado.email = query.data.founded.email;
				}
			} catch (err) {
				pro.capturarError(err.response);
			}
		},
	},
};
</script>
