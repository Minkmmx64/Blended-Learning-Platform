<template>
  <div class="System-main hidden w-full flex-row">
    <el-menu
      active-text-color="#2563EB"
      :background-color="config.MenuBackColor"
      class="scroll System-menu"
      text-color="#fff"
      :default-active="currentMenu"
      :default-openeds="[currentMenu]"
      :unique-opened="true"
      @select="MenuSelect"
      :collapse-transition="false"
      :collapse="collapse"
      :style="{ width: `${MenuWidth}px` , height: '100vh' }">
      <div class="text-center text-white fangzheng select-none flex-row flex-center mt-5 font-20 mb-5">
        <!-- <IconFont icon="setting-filling" class="mr-2" /> -->
        <span v-if="!collapse" style="font-size: 16px;">{{ title }}</span>
      </div>
      <MainSystemMenu :data="SystemMenus" />
      <!-- <el-button @click="MenuGoBack" class="w-full" type="primary">Back -</el-button> -->
    </el-menu>
    <div
      v-show="!collapse"
      v-minkm-drag
      class="System-drag select-none absolute flex-column flex-center"
      :style="{ width: `15px`, left: `${MenuWidth - 10}px`, height: `30px`, zIndex: 999 }">
      <div v-for="(item,index) in 4" :key="index" :style="{ height:'10px' }">..</div>
    </div>
    <div class="System-right flex-column text-white">
      <BreadNav 
        @togglecollapse="togglecollapse"
        @togglemenu="togglemenu"
        :active="currentMenu"
        :path="BreadNavPath"  />
      <!-- 主页面 -->
      <div class="System-view pl-5 pt-5">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, Directive, onUnmounted, onMounted } from 'vue';
import { SystemMenus, config } from "./AdminSystemLayout";
import MainSystemMenu from './child/MainSystemMenu.vue';
import BreadNav from "./child/BreadNav.vue";
import { useBreadNav, useMenu } from './child/hook';

interface IProps { title: string; }
const Props = withDefaults(defineProps<IProps>(), { title: "" } )

const { title } = toRefs(Props);
const { MenuWidth, MenuDrag } = useMenu();
const { BreadNavPath, selectMenu, togglecollapse, collapse, currentMenu, togglemenu } = useBreadNav(MenuWidth);
const MenuSelect = (index: string, indexPath: string[], item : string) =>  selectMenu(indexPath, index);

const vMinkmDrag : Directive = { mounted: (el: HTMLDivElement) =>  MenuDrag(el) }

const reFresh = () => {
  const Data = { currentMenu: currentMenu.value, BreadNavPath: BreadNavPath.value }
  localStorage.setItem("Data", JSON.stringify(Data));
}

onMounted(() => {
  window.addEventListener("beforeunload", reFresh);
  const Data = localStorage.getItem("Data");
  if(Data != null) {
    try {
      const { currentMenu: CM, BreadNavPath: BNP } = JSON.parse(Data);
      currentMenu.value = CM, BreadNavPath.value = BNP;
    } catch (error) { console.log("???"); }
  }
});
onUnmounted(() => { window.removeEventListener("beforeunload", reFresh); })

</script>
<style lang="scss" scoped>
.System-main{ height: 100vh; }
.System-drag{ top: 50%; cursor: move; }
.System-view{ flex-grow: 1; color: #000; }
.System-right{ height: 100vh; flex-grow: 1; }
</style>