<template>
  <div
    class="image-layout hidden"
    :style="{ width: Props.width + 'px', height: Props.height + 'px', borderRadius: Props.round ? '50%' : '10%' }"
  >
    <img
      :src="Fail"
      @error="LoadError"
    >
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
interface IProps {
  width?: number;
  height?: number;
  resource: string;
  round?: boolean;
}
const Props = withDefaults(
  defineProps<IProps>(),
  { width: 100, height: 100 , resource: "", round : false },
);
const Fail = ref(Props.resource);
const LoadError = () => 
  Fail.value = require("@/statis/empty.png");

watch(
  () => [ Props.resource ],
  () => { Fail.value = Props.resource }
)
</script>
  
<style lang="scss" scoped>
.image-layout {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>