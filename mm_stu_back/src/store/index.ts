import { defineStore } from 'pinia';
import { UserInfo } from '@/Request/ApiModules/root';
import { SystemMenus } from "@/components/System/AdminSystemLayout";
import { MenuItem } from '@/components/System/AdminSystemLayout.type';
import { ElMessage } from 'element-plus';
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
      Token: "",
      auths: [] as MenuItem[]
    }
  },
  getters : {
    getUser : state => state.User,
    getToken : state => state.Token,
    getAuths: state => state.auths
  },
  actions: {
    setUser(User: UserInfo){ this.User = User; },
    setToken(Token: string){ this.Token = Token; },
    clearInfo() { 
      this.User = nullUser; this.Token = "";
      sessionStorage.setItem("Data", null);
      ElMessage.info("正在退出...")
    },
    setAvatar(url: string){ this.User.avatar = url },
    setAuths(auths: []) { this.auths = auths; },
    TransformAuthMenu() {
      //比对权限列表
      const dfs = (ch: MenuItem[]): MenuItem[] => {
        const res = [] as MenuItem[];
        for(let i = 0 ; i < ch.length; i++) {
          const props = ch[i];
          if((this.auths as MenuItem[]).find( auth => auth.key === props.key)) {
            const o = {} as MenuItem;
            o.icon = props.icon;
            o.key = props.key;
            o.name = props.name;
            o.route = props.route
            if(props.subMenu){
              o.subMenu = dfs(props.subMenu);
            }
            res.push(o);
          }
        }
        return res;
      }
      if(this.User.role.id === 1) return SystemMenus;
      return dfs(SystemMenus);
      //return SystemMenus;
    }
  },
  persist: { enabled: true }
}
);