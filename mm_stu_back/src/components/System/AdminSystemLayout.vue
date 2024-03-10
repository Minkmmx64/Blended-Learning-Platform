<template>
  <div class="System-main hidden w-full flex-row">
    <el-menu
      active-text-color="#2563EB"
      :background-color="config.MenuBackColor"
      class="scroll System-menu"
      text-color="#fff"
      :default-active="currentMenu"
      :default-openeds="[currentMenu]"
      :unique-opened="!true"
      :collapse-transition="true"
      :collapse="collapse"
      :style="{ height: '100vh', padding: '0px 0px 0px 0px' }"
      @select="MenuSelect"
    >
      <div class="text-center text-white fangzheng select-none flex-row flex-center mt-5 font-20 mb-5">
        <!-- <IconFont icon="setting-filling" class="mr-2" /> -->
        <!-- <span v-if="!collapse" style="font-size: 16px;">{{ title }}</span> -->
      </div>
      <MainSystemMenu
        :data="User.TransformAuthMenu()"
        :collapse="collapse"
      />
      <!-- <el-button @click="MenuGoBack" class="w-full" type="primary">Back -</el-button> -->
    </el-menu>
    <!-- <div
      v-show="!collapse"
      v-minkm-drag
      class="System-drag select-none absolute flex-column flex-center"
      :style="{ width: `15px`, left: `${MenuWidth - 10}px`, height: `30px`, zIndex: 999 }">
      <div v-for="(item,index) in 4" :key="index" :style="{ height:'10px' }">..</div>
    </div> -->
    <div class="System-right flex-column text-white">
      <BreadNav 
        :active="currentMenu"
        :path="BreadNavPath"
        @togglecollapse="togglecollapse"
        @togglemenu="togglemenu"
      />
      <!-- 主页面 -->
      <div class="System-view hidden pt-5 pl-20">
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
          >
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
import { config } from "./AdminSystemLayout";
import MainSystemMenu from './child/MainSystemMenu.vue';
import BreadNav from "./child/BreadNav.vue";
import { useBreadNav, useMenu } from './child/hook';
import { useUserStore } from "@/store/index";

const User = useUserStore();

interface IProps { title: string; }
const Props = withDefaults(defineProps<IProps>(), { title: "" } )

const { title } = toRefs(Props);
const { MenuWidth, MenuDrag } = useMenu();
const { BreadNavPath, selectMenu, togglecollapse, collapse, currentMenu, togglemenu } = useBreadNav(MenuWidth);
const MenuSelect = (index: string, indexPath: string[], item : string) =>  selectMenu(indexPath, index);

const vMinkmDrag : Directive = { mounted: (el: HTMLDivElement) =>  MenuDrag(el) }

const reFresh = () => {
  const Data = { currentMenu: currentMenu.value, BreadNavPath: BreadNavPath.value }
  sessionStorage.setItem("Data", JSON.stringify(Data));
}

onMounted(() => {
  window.addEventListener("beforeunload", reFresh);
  const Data = sessionStorage.getItem("Data");
  if(Data != null) {
    try {
      const { currentMenu: CM, BreadNavPath: BNP } = JSON.parse(Data);
      currentMenu.value = CM, BreadNavPath.value = BNP;
    } catch (error) { console.error(error); }
  }
});
onUnmounted(() => { window.removeEventListener("beforeunload", reFresh); })

</script>
<style lang="css" scoped>
.System-main{ height: 100vh; }
.System-drag{ top: 50%; cursor: move; }
.System-view{ flex-grow: 1; color: #000; }
.System-right{ height: 100vh; flex-grow: 1; width: calc(100% - 250px); }

.System-main /deep/ .el-menu {
  border: none;
}
</style>