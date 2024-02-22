import { defineStore } from 'pinia';
import { UserInfo } from '@/Request/ApiModules/root';
import { SystemMenus } from "@/components/System/AdminSystemLayout";
import { MenuItem } from '@/components/System/AdminSystemLayout.type';
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue';
const nullUser: UserInfo = {
  username: "未登录", avatar: "", label: "",
  role: {
    id: -1,
    name: "未登录",
  },
  id: -1,
  teacher: null,
};

export const useUserStore = defineStore("User", 
  () => { 
    const User = ref<UserInfo>(nullUser);
    const Token = ref("");
    const Auths = ref<MenuItem[]>([]);
    const getUser = computed(() => User.value);
    const getToken = computed(() => Token.value);
    const getAuths = computed(() => Auths.value);
    const setUser = (user: UserInfo) => User.value = user;
    const setToken = (token: string) => Token.value = token;
    const clearInfo = () => {
      User.value = nullUser; Token.value = "";
      sessionStorage.setItem("Data", null);
      ElMessage.info("正在退出...");
    }
    const setAvatar = ( avatar: string ) => User.value.avatar = avatar;
    const setAuths = (auths: []) => Auths.value = auths;
    const TransformAuthMenu = () => {
      //比对权限列表
      const dfs = (ch: MenuItem[]): MenuItem[] => {
        const res = [] as MenuItem[];
        for (let i = 0; i < ch.length; i++) {
          const props = ch[i];
          if (Auths.value.find(auth => auth.key === props.key)) {
            const o = {} as MenuItem;
            o.icon = props.icon;
            o.key = props.key;
            o.name = props.name;
            o.route = props.route
            if (props.subMenu) {
              o.subMenu = dfs(props.subMenu);
            }
            res.push(o);
          }
        }
        return res;
      }
      if (User.value.role.id === 1) return SystemMenus;
      return dfs(SystemMenus);
    }

    return { User, Token, Auths, getAuths, getToken, getUser, setAuths, setAvatar,setUser, setToken, TransformAuthMenu, clearInfo }
  },
  { persist: { enabled: true } }
);