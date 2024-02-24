import { SocketConnectData, SocketManager } from "@/ws/WsConnect";
import { defineStore } from "pinia";
import { computed, ref } from "vue";


export const useWebSocketStore = defineStore("ws", () => {
  const Instance = ref<SocketManager | null>(null);

  const setInstance = (data: SocketConnectData) => {
    Instance.value = new SocketManager(data);
  }

  const getInstance = computed(() => Instance.value);

  return { getInstance , setInstance, Instance };
});