<template>
  <div class="login-layout-main hidden flex-column flex-center">
    <div class="login-layout-container hidden size-large shadow-info border-small bg-fff flex-row flex-alg">
      <!-- qrcode  /////////////////////////////////////////////// -->
      <div
        class="login-layout-qrcode h-full border-base flex-column flex-alg"
        style="width: 40%;"
      >
        <span class="select-none font-20 mt-50 w-full ml-50 text-white fangzheng">Welcome !!!</span>
        <!-- <ImageLayout class="hidden transparent border-info border-small mb-10 mt-10" :height="200" :width="200" :resource="src ?? ''" />
        <el-button @click="RefreshQRcode" type="primary">Refresh</el-button>
        <span class="font-14 mt-10 select-none text-white">使用App扫码登录</span> -->
      </div>
      <!-- qrcode  /////////////////////////////////////////////// -->

      <!-- login /////////////////////////////////////////////// -->
      <div
        v-if="LoginStatus == 'login'"
        class="login-layout-lg pl-10 bg-fff h-full border-base flex-column flex-alg"
        style="width: 60%;"
      >
        <span class="login-layout-lg-tit font-22 select-none w-full mt-20 pb-10 fangzheng"> Login......</span>
        <div class="login-layout-lg-container pt-10 h-full flex-column flex-alg">
          <template
            v-for="(item, index) in LoginFromData"
            :key="index"
          >
            <template v-if="item.showSms">
              <InputLayout
                v-model="item.bindvalue"
                :icon="item.icon"
                :placeholder="item.placeholder"
                :type="item.type"
              >
                <ShowSMSCode
                  :code="sms"
                  @refresh="getSmsCode"
                />
              </InputLayout>
            </template>
            <template v-else>
              <InputLayout
                v-model="item.bindvalue"
                :icon="item.icon"
                :placeholder="item.placeholder"
                :type="item.type"
              />
            </template>
          </template>
          <div class="w-full select-none  flex-row flex-between flex-alg">
            <el-checkbox
              v-model="RemberMe"
              label="记住我......"
              size="large"
            />
            <div class="flex-row">
              <IconFont
                class="text-primary mr-4"
                icon="unlock"
              />
              <el-link
                :underline="false"
                type="success"
                @click="LoginStatus = 'forget'"
              >
                忘记密码
              </el-link>
            </div>
          </div>
          <div class="w-full flex-row flex-alg mt-20 flex-around">
            <el-button
              type="success"
              @click="login"
            >
              登录
            </el-button>
            <el-link
              :underline="false"
              type="info"
              @click="LoginStatus = 'register'"
            >
              去注册 ->
            </el-link>
          </div>
          <div class="w-full flex-column flex-alg mt-18">
            <div class="w-full flex-row flex-alg flex-around mb-10">
              <IconFont
                class="point text-success"
                icon="weixin"
                :size="25"
              />
              <IconFont
                class="point"
                icon="QQ"
                :size="25"
              />
              <IconFont
                class="point text-primary"
                icon="twitter"
                :size="25"
              />
              <IconFont
                class="point text-primary"
                icon="zhifubao"
                :size="25"
              />
            </div>
            <el-link
              type="info"
              @click="OtherMethodLogin"
            >
              其他方式登录>>
            </el-link>
          </div>
        </div>
      </div>
      <!-- login end /////////////////////////////////////////////// -->

      <!-- register /////////////////////////////////////////////// -->
      <div
        v-else-if="LoginStatus == 'register'"
        class="login-layout-lg pl-10 bg-fff h-full border-base flex-column flex-alg"
        style="width: 60%;"
      >
        <span class="login-layout-lg-tit font-22 select-none w-full mt-20 pb-10 fangzheng"> Register......</span>
        <div class="login-layout-lg-container pt-10 h-full flex-column flex-alg">
          <template
            v-for="(item, index) in RegisterFromData"
            :key="index"
          >
            <template v-if="item.showSms">
              <InputLayout
                v-model="item.bindvalue"
                :icon="item.icon"
                :placeholder="item.placeholder"
                :type="item.type"
                :regex="item.regex"
              >
                <ShowSMSCode
                  :code="sms"
                  @refresh="getSmsCode"
                />
              </InputLayout>
            </template>
            <template v-else>
              <InputLayout
                v-model="item.bindvalue"
                :icon="item.icon"
                :placeholder="item.placeholder"
                :type="item.type"
                :regex="item.regex"
              />
            </template>
          </template>
          <div class="w-full flex-row flex-alg mt-10 flex-around">
            <el-button
              type="success"
              @click="register"
            >
              注册
            </el-button>
            <el-link
              :underline="false"
              type="info"
              @click="LoginStatus = 'login'"
            >
              &lt;- 返回
            </el-link>
          </div>
        </div>
      </div>
      <!-- register end /////////////////////////////////////////////// -->

      <!-- forget /////////////////////////////////////////////// -->
      <div
        v-else
        class="login-layout-lg pl-10 bg-fff h-full border-base flex-column flex-alg"
        style="width: 60%;"
      >
        <span class="login-layout-lg-tit font-22 select-none w-full mt-20 pb-10 fangzheng"> Forget......</span>
        <div class="login-layout-lg-container pt-10 h-full flex-column flex-alg">
          <template
            v-for="(item, index) in ForgetFromData"
            :key="index"
          >
            <template v-if="item.showSms">
              <InputLayout
                v-model="item.bindvalue"
                :icon="item.icon"
                :placeholder="item.placeholder"
                :type="item.type"
                :regex="item.regex"
              >
                <ShowSMSCode
                  :code="sms"
                  @refresh="getSmsCode"
                />
              </InputLayout>
            </template>
            <template v-else>
              <InputLayout
                v-model="item.bindvalue"
                :icon="item.icon"
                :placeholder="item.placeholder"
                :type="item.type"
                :regex="item.regex"
              />
            </template>
          </template>
          <div class="w-full flex-row flex-alg mt-10 flex-around">
            <el-button
              type="success"
              @click="forget"
            >
              提交
            </el-button>
            <el-link
              :underline="false"
              type="info"
              @click="LoginStatus = 'login'"
            >
              &lt;- 返回
            </el-link>
          </div>
        </div>
      </div>
      <!-- forget end /////////////////////////////////////////////// -->
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import Qrcode from "qrcode";
import ShowSMSCode from "@/components/display/from//ShowSMSCode.vue";
import InputLayout from "../display/from/InputLayout.vue";
import { User } from "./LoginLayout.type";
import IconFont from "../display/icon/IconFont.vue";
import { FromModel } from "./model";
import Common from "@/Request/ApiModules/common";
import { ElMessage } from "element-plus";

interface IEmits {
  (event: "login", FromData: Record<keyof User.LoginProps, string>): void;
  (event: "register", FromData: Record<keyof User.RegisterProps, string>): void;
  (event: "forget", FromData: Record<keyof User.ForgetProps, string>): void;
}
interface IProps {
  LoginFails: boolean;
  RegistFails: boolean;
}

const Props = withDefaults(
  defineProps<IProps>(),
  { LoginFails: false, RegistFails: false }
)

watchEffect(() => {
  if(Props.LoginFails){
    getSmsCode();
  }
  if(Props.RegistFails){
    getSmsCode();
  }
});

//验证码
const sms = ref("");
const getSmsCode = async () => {
  try {
    const { data } = await Common.Sms();
    sms.value = data.data;
  } catch (error : any) {
    if(error){
      ElMessage.error("获取验证码错误" + error);
    }
  }
}
const GenerateQRcode = async (str: string): Promise<string> => await Qrcode.toDataURL(
  document.createElement("canvas"),
  str,
  { width: 200, type: "image/png" }
);

//二维码
const code = "4423rfergrehrtjyu4423rfergreh";
const emit = defineEmits<IEmits>();
const LoginStatus = ref<"login" | "register" | "forget">("login");
const src = ref();
const RefreshQRcode = () => GenerateQRcode(code+code/**生成二维码密钥 */).then(ret => src.value = ret);

// !!!------------------- 其他表单属性在这 -------------------!!! //
const RemberMe = ref(true);
const [ LoginFromData, LoginData ] = FromModel.Login.builder();
const [ RegisterFromData, RegisterData ] = FromModel.Register.builder();
const [ ForgetFromData, ForgetData ] = FromModel.Forget.builder();

const OtherMethodLogin = () => console.log("OtherMethodLogin");
const login = () => emit("login", LoginData());
const register = () => emit("register", RegisterData());
const forget = () => emit("forget", ForgetData());

onMounted(() => {
  GenerateQRcode(code).then(ret => src.value = ret);
});
</script>
  
<style lang="scss" scoped>
.login-layout-main {
  background-color: #f1f2f6;
  width: 100%;
  height: 100vh;
}

.login-layout-container {
  height: 600px;
}

.login-layout-qrcode {
  border-right: 2px solid $info;
  background-image: url("https://images.unsplash.com/photo-1527769929977-c341ee9f2033?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80");
}

.login-layout-reg {
  background-color: red;
}

.login-layout-lg {
  .login-layout-lg-tit {
    border-bottom: 2px solid $info;
  }

  .login-layout-lg-container {
    width: 75%;
  }
}
</style>