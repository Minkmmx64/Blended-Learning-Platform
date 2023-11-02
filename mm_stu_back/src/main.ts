import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from "pinia";
import ElementPlus from 'element-plus';
import piniaPluginPersist from 'pinia-plugin-persist';
import  "./assets/font_3321676_02zuaugnhetm/iconfont.css";
import 'element-plus/dist/index.css';

const pinia = createPinia();
pinia.use(piniaPluginPersist);
const app = createApp(App);

app
.use(router)
.use(pinia as any)
.use(ElementPlus)

app.mount('#app');
