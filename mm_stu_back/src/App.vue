<template>
  <router-view/>
</template>

<script lang="ts" setup>
import { useUserStore } from './store';
const u = useUserStore();
console.log(u.getUser);
</script>

<style lang="scss">
*{ padding: 0; margin: 0; }
input,textarea,button { outline: none; }
</style>
