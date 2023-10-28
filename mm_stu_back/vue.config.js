const { defineConfig } = require('@vue/cli-service');
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new MonacoWebpackPlugin()],
  },
  devServer: {
    port: 3000,
    // proxy: {
    //   "/api" : {
    //     target: "http://192.168.159.40:3000",
    //     changeOrigin : true,
    //     pathRewrite: {
    //       "^/api": ""
    //     }
    //   }
    // }
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "./src/components/style/index.scss";`,
      },
    },
  },
});
