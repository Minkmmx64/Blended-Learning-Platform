<template>
  <LoginLayout 
    @login="login"
    @forget="forget"
    @register="register" />
</template>
  
<script setup lang="ts">
import { User } from "@/components/User/LoginLayout.type";
import LoginLayout from "@/components/User/LoginLayout.vue";
import { useRouter } from "vue-router";
import Common from "@/Request/Modules/common";
const AdminLogin = useRouter();

// !--------------------------点击登录按钮将要发生的事情...--------------------------! //
const login = async (e: Record<keyof User.LoginProps, string>) => {
  // 登录
  try {
    const { data } = await Common.vSms(e.sms);
    
  } catch (error) {
    
  }
  //alert(JSON.stringify(e));
  //AdminLogin.push({name: 'system'})
}

// !--------------------------点击注册按钮将要发生的事情...--------------------------! //
const register = (e: Record<keyof User.RegisterProps, string>) => {
  alert(JSON.stringify(e));
}

// !--------------------------点击忘记密码将要发生的事情...--------------------------! //
const forget = (e: Record<keyof User.ForgetProps, string>) => {
  alert(JSON.stringify(e));
}

</script>
  
<style lang="scss" scoped>
  
</style>