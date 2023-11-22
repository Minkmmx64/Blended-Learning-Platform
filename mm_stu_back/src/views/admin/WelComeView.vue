<template>
  <div>
    <div>管理系统主页, 欢迎: {{ User.getUser.username }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/store";
import Common from "@/Request/ApiModules/common"

const User = useUserStore();

</script>
  
<style lang="scss" scoped>
  
</style>