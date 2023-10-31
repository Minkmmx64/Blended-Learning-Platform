<template>
  <LoginLayout 
    @login="login"
    @forget="forget"
    @register="register" 
    :RegistFails="RegistFails"
    :LoginFails="LoginFails"/>
</template>
  
<script setup lang="ts">
import { InputFromType, User } from "@/components/User/LoginLayout.type";
import LoginLayout from "@/components/User/LoginLayout.vue";
import { useRouter } from "vue-router";
import Common from "@/Request/Modules/common";
import Root from "@/Request/Modules/root";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { Icon } from "@/components/User/model";

const AdminLogin = useRouter();

const LoginFails = ref(false);
const RegistFails = ref(false);

// !--------------------------点击登录按钮将要发生的事情...--------------------------! //
const login = async (e: Record<keyof User.LoginProps, string>) => {
  LoginFails.value = false;
  try {
    await Common.vSms(e.sms);
  } catch (error) {
    LoginFails.value = true;
    ElMessage.error("验证码错误");
  }
  //AdminLogin.push({name: 'system'})
}

// !--------------------------点击注册按钮将要发生的事情...--------------------------! //
const register = async (e: Record<keyof User.RegisterProps, string>) => {
  RegistFails.value = false;
  try {
    const ok = await Common.vSms(e.sms);
    if(ok) {
      await Root.regist({
        username: e.username,
        password: e.password,
        bpassword: e.bpassword,
        phone: e.mobilephone
      });
    }
  } catch (error : any) {
    ElMessage.error("验证码错误")
    RegistFails.value = true;
  }
}
// !--------------------------点击忘记密码将要发生的事情...--------------------------! //
const forget = (e: Record<keyof User.ForgetProps, string>) => {
  alert(JSON.stringify(e));
}
</script>