<template>
  <LoginLayout 
    @login="login"
    @forget="forget"
    @register="register" 
    :RegistFails="RegistFails"
    :LoginFails="LoginFails"/>
</template>
  
<script setup lang="ts">
import { User } from "@/components/User/LoginLayout.type";
import LoginLayout from "@/components/User/LoginLayout.vue";
import { useRouter } from "vue-router";
import Common from "@/Request/Modules/common";
import Root from "@/Request/Modules/root";
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
    if(ok) {
      const login = await Root.login({
        username: e.username,
        password: e.password
      });
      if(login){
        const { token, user } = login.data.data;
        const useUser = useUserStore();
        useUser.setUser(user);
        useUser.setToken(token);
        ElMessage.success("登录成功");
        AdminLogin.push({name: 'system'});
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
    if(ok) {
      const reg = await Root.regist({
        username: e.username,
        password: e.password,
        bpassword: e.bpassword,
        phone: e.mobilephone
      });
      if(reg) {
        ElMessage.success("注册成功");
        location.reload();
      }
    }
  } catch (error : any) {
    ElMessage.error("验证码错误")
    RegistFails.value = true;
  }
}


const forget = (e: Record<keyof User.ForgetProps, string>) => {
  alert(JSON.stringify(e));
}
</script>