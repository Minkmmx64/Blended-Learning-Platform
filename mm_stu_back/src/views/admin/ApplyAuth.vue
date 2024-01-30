<template>
  <div>
    <div
        class="w-full flex-row font-25 flex-center select-none"
        style="color:  #E53A40;"
    >
      <IconFont
          class="mr-20"
          icon="announcement"
      />
      <span>申请教师角色只需要输入该教师编码即可 ,申请会通知给系统管理员，请耐心等待   !</span>
    </div>
    <div class="w-full flex-column flex-center mt-50">
      <div class="w-full flex-row flex-center select-none">
        <span class="mr-50" style="color: #E53A40">教师编号:</span>
        <el-input v-model="code" style="width: 200px" />
      </div>
      <el-button @click="teacherAuthorization" type="warning" class="mt-50">认证</el-button>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import IconFont from "@/components/display/icon/IconFont.vue";
import { ref } from "vue";
import { useUserStore } from "@/store/index";
import root from "@/Request/ApiModules/root";
const code = ref<string>();
const user = useUserStore();
const teacherAuthorization = async () => {
  try {
    await root.teacherAuth(user.User.id, code.value);
  } catch (e){
    console.log(e);
  }
}
</script>
  
<style lang="scss" scoped>
  
</style>