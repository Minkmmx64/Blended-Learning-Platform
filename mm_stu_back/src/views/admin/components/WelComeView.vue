<template>
  <div>
    <div>管理系统主页, 欢迎: {{ User.getUser.username }}</div>
    <el-button @click="ck">call</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/store";
import Common from "@/Request/Modules/common"
const User = useUserStore();

const ck = () => {
  Common.test().then( res => {
    console.log(res);
  }).catch( error => {
    console.log(error);
  })
}

</script>
  
<style lang="scss" scoped>
  
</style>