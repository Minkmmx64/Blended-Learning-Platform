<template>
  <router-view />
</template>

<script lang="ts" setup>
import { debounce } from './utils/debounce';

const _ = (window as any).ResizeObserver;
(window as any).ResizeObserver = class ResizeObserver extends _ {
  constructor(callback: (...args: any[]) => void) {
    callback = debounce(callback, 20);
    super(callback);
  }
};


</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}

input,
textarea,
button {
  outline: none;
}</style>
