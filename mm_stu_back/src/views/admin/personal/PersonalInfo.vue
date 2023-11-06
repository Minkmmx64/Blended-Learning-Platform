<template>
  <div class="flex flex-column flex-alg select-none">
    <ImageLayout :width="150" :round="true" :height="150" :resource="User.getUser.avatar ?? ''" />
    <el-button link type="success">
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        :before-upload="onBeforeUpload">
        <span>上传头像</span>
        <el-icon class="el-icon--right"><Upload /></el-icon>
      </el-upload>
    </el-button>
    <div class="text-primary font-16 mt-10">
      <div>{{ User.getUser.username }}</div>
      <el-button link type="info" disabled>{{ User.getUser.role.name }}</el-button>
    </div>
    <div class="font-16 mt-10">
      <el-input
        v-model="InfoEdit.label"
        :rows="2"
        type="textarea"
        disabled
        resize="none"
        placeholder="Please input"/>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/store";
import ImageLayout from "@/components/display/img/ImageLayout.vue";
import { Upload } from '@element-plus/icons-vue'
import { RootInfoEdit } from "@/Request/Modules/root";
import { UploadRawFile } from "element-plus";

const User = useUserStore();
const InfoEdit = ref<RootInfoEdit>({
  username: User.getUser.username,
  avatar: User.getUser.avatar,
  label: User.getUser.label ?? "暂无"
});

const onBeforeUpload = (rawFile: UploadRawFile) =>  {
  console.log(rawFile);
  
  return false;
}
</script>
  
<style lang="scss" scoped>
  
</style>