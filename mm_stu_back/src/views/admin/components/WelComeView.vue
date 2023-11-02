<template>
  <div>管理系统主页, 欢迎: {{ User.getUser.username }}</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/store";
const User = useUserStore();

</script>
  
<style lang="scss" scoped>
  
</style>