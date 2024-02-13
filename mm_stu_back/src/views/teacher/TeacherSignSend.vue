<template>
  <div class="flex-row">
    <!-- 选择签到班级 -->
    <el-menu
      active-text-color="#2563EB"
      :background-color="config.MenuBackColor"
      class="scroll"
      text-color="#fff"
      :unique-opened="!true"
      :collapse-transition="true"
      :style="{ height: '100vh', padding: '0px 0px 0px 0px', width: '200px', zIndex: 99999 }"
      @select="selectClass"
    >
      <MainSystemMenu
        :data="[
          {
            name: '1班',
            key: '12222222222'
          }
        ]"
      />
    </el-menu>
    <!-- 选择签到课程 -->
    <el-menu
      v-if="currentSelectClass"
      active-text-color="#2563EB"
      :background-color="config.MenuBackColor"
      class="scroll move-in"
      text-color="#fff"
      :default-openeds="[]"
      :unique-opened="!true"
      :collapse-transition="true"
      :style="{ height: '100vh', padding: '0px 0px 0px 0px', width: '200px' }"
    >
      <MainSystemMenu
        :data="[
          {
            name: '计算机',
            key: 'cc'
          }
        ]"
      />
    </el-menu>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
import MainSystemMenu from '@/components/System/child/MainSystemMenu.vue';
import { config } from "@/components/System/AdminSystemLayout";
import { MenuItemClicked } from "element-plus";
import { NavigationFailure } from "vue-router";
//当前选中班级
const currentSelectClass = ref("");
const currentSelectCourse = ref("");
/**
 * 获取教师的班级
 * 获取教师的课程
 */
const selectClass = (key: string, indexPath: string[], item: MenuItemClicked, routerResult?: Promise<void | NavigationFailure>) => {
  currentSelectClass.value = key;
}
</script>

<style lang="scss" scoped>
.move-in {
  animation: movein 500ms ease;
}

@keyframes movein {
  0% {
    transform: translateX(-200px);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>