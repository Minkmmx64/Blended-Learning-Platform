const { defineConfig } = require('@vue/cli-service');
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const CDP = require("circular-dependency-plugin");
module.exports = defineConfig({
  lintOnSave: false, 
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin(),
      new CDP({
      exclude: /node_modules/,
      include: /src/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd()
    })],
  },
  devServer: {
    port: 3000,
    
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "./src/components/style/index.scss";`,
      },
    },
  },
});
