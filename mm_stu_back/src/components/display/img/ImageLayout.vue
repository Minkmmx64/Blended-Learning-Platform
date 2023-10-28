<template>
  <div class="image-layout" :style="{ width: Props.width + 'px', height: Props.height + 'px' }">
    <img @error="LoadError" :src="Fail" />
  </div>
</template>
  
<script setup lang="ts">
import { ref, watch } from "vue";
interface IProps {
  width?: number;
  height?: number;
  resource: string;
}
const Props = withDefaults(
  defineProps<IProps>(),
  { width: 100, height: 100 }
);
const Fail = ref(Props.resource);
const LoadError = () => Fail.value = "https://unsplash-assets.imgix.net/empty-states/photos.png";
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