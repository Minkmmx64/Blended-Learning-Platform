import { defineStore } from 'pinia';
import { UserInfo } from '@/Request/ApiModules/root';

const nullUser: UserInfo = { username: "未登录", avatar: "", label: "",
  role: {
    id: -1,
    name: "未登录",
  }
};

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
    clearInfo() { this.User = nullUser; this.Token = ""; },
    setAvatar(url: string){ this.User.avatar = url }
  },
  persist: { enabled: true }
}
);