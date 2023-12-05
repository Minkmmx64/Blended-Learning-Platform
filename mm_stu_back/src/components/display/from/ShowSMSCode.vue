<template>
  <div
    class="h-full"
    style="width: 150px;"
    @click="emit('refresh')"
    v-html="Props.code"
  />
</template>
  
<script setup lang="ts">


import { onMounted, ref } from "vue";
interface IProps {
  code : string;
}
interface IEmits {
  (event: "refresh") : void;
}
const emit = defineEmits<IEmits>();
const Props = withDefaults(
  defineProps<IProps>(),
  { code: "" }
);

onMounted(() => emit("refresh"))
</script>
  
<style lang="scss" scoped>
  
</style>