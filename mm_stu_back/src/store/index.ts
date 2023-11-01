import { UserInfo } from '@/Request/Modules/root';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';


export const useUserStore = defineStore("User", () => {
  const nullUser = {
    username: "未登录",
    avatar: "",
    label: ""
  };

  const Token = ref("");
  const User = ref<UserInfo>(nullUser);
  const TokenKey = "AuthToken";

  const getUser = computed(() => User.value);
  const getToken = computed(() => Token.value);

  function setUser(info : UserInfo) {
    User.value = info;
  }

  function setTokenToLocal(token: string) {
    Token.value = token;
    localStorage.setItem(TokenKey, Token.value);
  }

  function getTokenToLocal() {
    return localStorage.getItem(Token.value);
  }

  //清除登录信息
  function clearInfo(){
    setUser(nullUser);
    localStorage.removeItem(TokenKey);
  }

  return {
    getUser,
    getToken,
    setUser,
    setTokenToLocal,
    getTokenToLocal,
    clearInfo
  }

});