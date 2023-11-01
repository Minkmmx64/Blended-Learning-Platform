import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { PiniaPlugin, createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import piniaPluginPersist from 'pinia-plugin-persist';
import  "./assets/font_3321676_02zuaugnhetm/iconfont.css";
import 'element-plus/dist/index.css';

const pinia = createPinia();
const app = createApp(App);
pinia.use(piniaPluginPersist as unknown as PiniaPlugin);
app
.use(router)
.use(pinia)
.use(ElementPlus)

app.mount('#app');
