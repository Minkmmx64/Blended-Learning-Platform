<template>
  <div>
    <div>管理系统主页, 欢迎: {{ User.getUser.username }}</div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store";

const User = useUserStore();

</script>
  
<style lang="scss" scoped>
  
</style>