<template>
  <LoginLayout 
    @login="login"
    @forget="forget"
    @register="register" 
    :LoginFails="LoginFails"/>
</template>
  
<script setup lang="ts">
import { User } from "@/components/User/LoginLayout.type";
import LoginLayout from "@/components/User/LoginLayout.vue";
import { useRouter } from "vue-router";
import Common from "@/Request/Modules/common";
import Root from "@/Request/Modules/root";
import { ref } from "vue";

const AdminLogin = useRouter();

const LoginFails = ref(false);

// !--------------------------点击登录按钮将要发生的事情...--------------------------! //
const login = async (e: Record<keyof User.LoginProps, string>) => {
  LoginFails.value = false;
  // 登录
  try {
    const { data } = await Common.vSms(e.sms);
  } catch (error) {
    LoginFails.value = true;
  }
  //alert(JSON.stringify(e));
  //AdminLogin.push({name: 'system'})
}

// !--------------------------点击注册按钮将要发生的事情...--------------------------! //
const register = async (e: Record<keyof User.RegisterProps, string>) => {
  try {
    await Common.vSms(e.sms);
    const { data } = await Root.regist({
      username: e.username,
      password: e.password,
      bpassword: e.bpassword,
      phone: e.mobilephone
    });
    console.log(data);
  } catch (error) {
    
  }
}

// !--------------------------点击忘记密码将要发生的事情...--------------------------! //
const forget = (e: Record<keyof User.ForgetProps, string>) => {
  alert(JSON.stringify(e));
}

</script>
  
<style lang="scss" scoped>
  
</style>