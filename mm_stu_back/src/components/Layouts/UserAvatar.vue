<template>
  <div class="user-avatar border-round border-info absolute hidden">
    <el-dropdown>
      <ImageLayout
        class="point"
        :resource="UserStore.getUser.avatar ?? ''"
        :width="36"
        :height="36"
      />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="LogOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
  
<script setup lang="ts">
import { useUserStore } from "@/store/index";
import ImageLayout from "../display/img/ImageLayout.vue";
import { useRouter } from "vue-router";
const UserStore = useUserStore();
const router = useRouter();
const LogOut = () => {
  UserStore.clearInfo();
  router.replace({
    name: "Home"
  });
}
</script>
  
<style lang="scss" scoped>
  .user-avatar {
    right: 50px;
    width: 36px;
    height: 36px;
  }
</style>