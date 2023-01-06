<template>
	<v-flex>
		<base-material-card color="primary" title="LOGIN" icon="mdi-login" class="px-5 py-3 mx-auto primary--text" width="450">
			<v-alert v-if="error !== null" type="error" dismissible border="left" colored-border color="primary" elevation="5" class="my-5">
				{{ error }}
			</v-alert>
			<v-form @submit.prevent="loader = 'loading'">
				<v-text-field
					v-model="account.username"
					:disabled="loading"
					hide-details
					label="Usuario"
					prepend-icon="mdi-account-circle"
					placeholder="Ingrese usuario"
					class="mt-10"
				></v-text-field>
				<v-text-field
					v-model="account.password"
					:disabled="loading"
					label="Contraseña"
					hide-details
					prepend-icon="mdi-lock"
					:type="showPassword ? 'text' : 'password'"
					:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
					@click:append="showPassword = !showPassword"
					class="my-5"
				></v-text-field>
				<v-btn class="my-10 display-1" :loading="loading" :disabled="loading" block color="primary" large type="submit">
					LOGIN
					<template v-slot:loader>
						<span class="custom-loader">
							<v-icon>mdi-cached</v-icon>
						</span>
					</template>
				</v-btn>
			</v-form>
		</base-material-card>
	</v-flex>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
	name: "LoginPortada",

	data() {
		return {
			loader: null,
			loading: false,
			showPassword: false,
			account: { username: "", password: "" },
			defaultAccount: { username: "", password: "" },
		};
	},

	computed: {
		error() {
			return this.$store.state.error !== null ? this.$store.state.error.data.message : null;
		},
	},

	watch: {
		loader(val) {
			let l = this.loader;
			this[l] = !this[l];

			val &&
				setTimeout(() => {
					this[l] = false;
					// console.log('Empieza en 5 seg');
				}, 5000);

			val &&
				setTimeout(() => {
					this.iniciarSesion(this.account);
					// console.log('Empieza en 1 seg');
				}, 1000);

			this.loader = null;
		},
	},

	methods: {
		...mapActions(["iniciarSesion"]),
	},
};
</script>
<style>
.custom-loader {
	animation: loader 1s infinite;
	display: flex;
}

@-moz-keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}

@-webkit-keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}

@-o-keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}

@keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
