import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import  "./assets/font_3321676_02zuaugnhetm/iconfont.css";
import 'element-plus/dist/index.css';

const pinia = createPinia();
const app = createApp(App);

app
.use(router)
.use(pinia)
.use(ElementPlus)

app.mount('#app');
