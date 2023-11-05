import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import { useRouter } from "vue-router";
import Root, { UserInfo, RootLoginDTO } from '@/Request/Modules/root';

const nullUser: UserInfo = { username: "未登录", avatar: "", label: "",
  role: {
    id: -1,
    name: "未登录",
    routers: "",
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
    clearInfo() { this.User = nullUser; this.Token = ""; }
  },
  persist: { enabled: true }
}
);