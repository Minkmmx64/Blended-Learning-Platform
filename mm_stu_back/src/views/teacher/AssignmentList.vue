<template>
  <div class="h-full">
    <Transition name="slide-fade">
      <renderAssignLists v-if="currentCompoment === 0" @toogleAssign="toogleAssign" />
      <renderStudentAssign  :examId="currentExamId" :paper="currentPaperId" @back="currentCompoment = 0" v-else />
    </Transition>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
import renderAssignLists from './compoment/renderAssignLists.vue';
import renderStudentAssign from './compoment/renderStudentAssign.vue';

const currentCompoment = ref(0);
const currentExamId = ref<undefined | number>();
const currentPaperId = ref<undefined | number>();

const toogleAssign = (val: number, paper: number) => {
  currentCompoment.value = 1;
  currentExamId.value = val;
  currentPaperId.value = paper;
}
</script>
  
<style lang="scss" scoped>
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
  position: absolute;
}
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
  position: absolute;
}
</style>