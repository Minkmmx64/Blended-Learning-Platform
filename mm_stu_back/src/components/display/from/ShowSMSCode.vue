<template>
  <div @click="tap" class="h-full" style="width: 150px;" v-html="code"></div>
</template>
  
<script setup lang="ts">
import Common from "@/Request/Modules/common";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";

const code = ref();

const tap = async () => {
  try {
    const { data } = await Common.Sms();
    code.value = data;
  } catch (error : any) {
    ElMessage.error(error);
  }
}

onMounted( async () => {
  tap();
})
</script>
  
<style lang="scss" scoped>
  
</style>