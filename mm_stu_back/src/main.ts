import { ObjectDirective, createApp } from 'vue';
import { createPinia } from "pinia";
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import piniaPluginPersist from 'pinia-plugin-persist';
import showTime from "@/components/display/showTime.vue";
import IconFont from "@/components/display/icon/IconFont.vue";
import TableContent from "@/components/display/table/TableContent.vue";
import ImageLayout from "@/components/display/img/ImageLayout.vue";
import  "./assets/font_3321676_e42xnb5xu6i/iconfont.css";
import 'element-plus/dist/index.css';

const pinia = createPinia();
pinia.use(piniaPluginPersist);
const app = createApp(App);

app
.use(router)
.use(pinia as any)
.use(ElementPlus)

app.component("ShowTime", showTime)
app.component("IconFont", IconFont)
app.component("TableContent", TableContent)
app.component("ImageLayout", ImageLayout)
app.mount('#app');


// 自定义 指令
app.directive("directive", {
  created(el, binding, vnode, prevVnode) {
    console.log(el);
    console.log(binding);
    console.log(vnode);
    console.log(prevVnode);
  },
  updated(el, binding, vnode, prevVnode) {
    console.log(el);
    console.log(binding);
    console.log(vnode);
    console.log(prevVnode);
  },
} as ObjectDirective<HTMLDivElement, any>)
