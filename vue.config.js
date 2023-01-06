module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/sgl/" : "/",

    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            args[0].title = "SGL - Nororiente";
            return args;
        });
    },

    configureWebpack:{
		performance:{
			hints: false
		},
		optimization:{
			splitChunks:{
				minSize: 10000,
				maxSize: 500000,
			}
		}
	},

    lintOnSave: false,

    devServer: {
        disableHostCheck: true,
    },

    transpileDependencies: ["vuetify"],
};
