import { UserInfo } from '@/Request/Modules/root';
import { defineStore } from 'pinia';

const nullUser = { username: "未登录", avatar: "", label: "" };

export const useUserStore = defineStore("User",{
  state: () => {
    return {
      User: nullUser as UserInfo,
      Token: ""
    }
  },
  getters : {
    getUser : state => state.User,
    getToken : state => state.Token
  },
  actions: {
    setUser(User: UserInfo){ this.User = User; },
    setToken(Token: string){ this.Token = Token; },
    clearInfo() { this.User = nullUser; this.Token = ""; }
  },
  persist: { enabled: true }
}
);