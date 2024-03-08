<template>
  <router-view class="scroll" />
</template>

<script lang="ts" setup>
import { useUserStore } from './store';
import { useWebSocketStore } from './store/WebSocketStore';
import { debounce } from './utils/debounce';

/**
 * el 组件改变窗口报错
 */
const _ = (window as any).ResizeObserver;
(window as any).ResizeObserver = class ResizeObserver extends _ {
  constructor(callback: (...args: any[]) => void) {
    callback = debounce(callback, 20);
    super(callback);
  }
};

/**
 * 用户网页刷新重连websocket
 */
const user = useUserStore();
if(user.getUser.role.name === "教师") {
  const ws = useWebSocketStore();
  ws.setInstance({ type: "teacher", id: user.getUser.teacher.id});
}

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
