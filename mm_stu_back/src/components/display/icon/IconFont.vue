<template>
  <div
    :class="'h-full iconfont ' + Props.icon"
    :style="{ fontSize: size + 'px' }"
  />
</template>
  
<script setup lang="ts">


interface IProps {
  icon : string;
  size?: number;
}

const Props = withDefaults(
  defineProps<IProps>(),
  {
    icon: "home-filling",
    size: 20
  }
)

</script>