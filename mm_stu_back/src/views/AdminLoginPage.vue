<template>
  <LoginLayout
    :regist-fails="RegistFails"
    :login-fails="LoginFails"
    @login="login"
    @forget="forget"
    @register="register"
  />
</template>
  
<script setup lang="ts">
import { User } from "@/components/User/LoginLayout.type";
import LoginLayout from "@/components/User/LoginLayout.vue";
import { useRouter } from "vue-router";
import Common from "@/Request/ApiModules/common";
import Root from "@/Request/ApiModules/root";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/index";

const AdminLogin = useRouter();
const LoginFails = ref(false);
const RegistFails = ref(false);

const login = async (e: Record<keyof User.LoginProps, string>) => {
  LoginFails.value = false;
  try {
    const ok = await Common.vSms(e.sms);
    if (ok) {
      try {
        const login = await Root.login({
          username: e.username,
          password: e.password
        });
        if (login) {
          const { token, user } = login.data.data;
          const useUser = useUserStore();
          useUser.setUser(user);
          useUser.setToken(token);
          /**
           * 加载权限表
           */
          ElMessage.info("加载权限表");
           Root.auth(user.role.id).then( res => {
            setTimeout(() => {
              ElMessage.success("加载成功");
              const routers = res.data.data;
              useUser.setAuths(routers);
              ElMessage.success("登录成功");
              AdminLogin.push({ name: 'System' });
            }, 500);
           })
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    LoginFails.value = true;
    ElMessage.error("验证码错误");
  }
}

const register = async (e: Record<keyof User.RegisterProps, string>) => {
  RegistFails.value = false;
  try {
    const ok = await Common.vSms(e.sms);
    if (ok) {
      try {
        const reg = await Root.regist({
          username: e.username,
          password: e.password,
          bpassword: e.bpassword,
          phone: e.mobilephone
        });
        if (reg) {
          ElMessage.success("注册成功");
          location.reload();
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error: any) {
    ElMessage.error("验证码错误")
    RegistFails.value = true;
  }
}


const forget = (e: Record<keyof User.ForgetProps, string>) => {
  alert(JSON.stringify(e));
}
</script>