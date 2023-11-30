<template>
  <div class="user-avatar border-round border-info absolute hidden">
    <ImageLayout :resource="UserStore.getUser.avatar ?? ''" :width="36" :height="36" />
  </div>
  <div>{{  UserStore.getUser.username }}</div>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "@/store/index";
import ImageLayout from "../display/img/ImageLayout.vue";
const UserStore = useUserStore();
onMounted(() => {
  console.log(UserStore.getUser);
})
</script>
  
<style lang="scss" scoped>
  .user-avatar {
    right: 50px;
    width: 36px;
    height: 36px;
  }
</style>