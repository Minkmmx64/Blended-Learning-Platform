<template>
  <div
    id="BezierCurve"
    class="flex-column flex-center"
  >
    <canvas ref="BezierCurve" />
  </div>
</template>
  
<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { useBezierCurve } from "./BezierCurve";
const BezierCurve = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const {} = useBezierCurve(BezierCurve);
})
</script>
  
<style lang="scss" scoped>
  
</style>