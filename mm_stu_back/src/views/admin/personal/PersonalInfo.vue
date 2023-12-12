<template>
  <div class="flex flex-column flex-alg select-none">
    <ImageLayout
      class="mt-5"
      :width="130"
      :round="true"
      :height="130"
      :resource="User.getUser.avatar ?? ''"
    />
    <el-button
      link
      type="success"
    >
      <el-upload
        v-if="isEdit"
        ref="uploadRef"
        class="upload-demo mt-5"
        :before-upload="onBeforeUpload"
      >
        <span>上传头像</span>
        <el-icon class="el-icon--right">
          <Upload />
        </el-icon>
      </el-upload>
    </el-button>
    <div class="text-primary font-16 mt-10">
      <template v-if="!isEdit">
        <div>{{ User.getUser.username }}</div>
        <el-button
          link
          type="info"
          disabled
        >
          {{ User.getUser.role?.name }}
        </el-button>
      </template>
      <template v-else>
        <el-row class="mb-5 text-center">
          <el-col :span="8">
            <div class="h-full flex-row flex-center">
              <span>新用户名:</span>
            </div>
          </el-col>
          <el-col :span="16">
            <el-input
              v-model="InfoEdit.rusername"
              placeholder="menu name"
            />
          </el-col>
        </el-row>
      </template>
    </div>
    <div class="font-16 mt-10">
      <el-input
        v-model="InfoEdit.label"
        :rows="2"
        type="textarea"
        :disabled="!isEdit"
        resize="none"
        placeholder="Please input"
      />
    </div>
    <el-button
      v-if="!isEdit"
      class="mt-5"
      type="warning"
      @click="isEdit = true"
    >
      编辑
    </el-button>
    <el-button
      v-else
      class="mt-5"
      :loading="isLoading"
      type="success"
      @click="userInfoSave"
    >
      保存
    </el-button>
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "@/store";
import { Upload } from '@element-plus/icons-vue'
import { RootInfoEdit } from "@/Request/ApiModules/root";
import { ElMessage, UploadRawFile } from "element-plus";
import common from "@/Request/ApiModules/common";
import root from "@/Request/ApiModules/root";

const User = useUserStore();

const InfoEdit = ref<RootInfoEdit>({
  username: User.getUser.username,
  avatar: User.getUser.avatar,
  label: User.getUser.label ?? "暂无",
  rusername: User.getUser.username
});

const isEdit = ref(false);
const isLoading = ref(false);

const onBeforeUpload = (rawFile: UploadRawFile) => {
  const data = new FormData();
  data.append("file", rawFile);
  common.upload(data).then(res => {
    setTimeout(() => {
      const url = res.data.data.url;
      InfoEdit.value.avatar = url;
      ElMessage.success("上传成功!");
      User.setAvatar(url);
    }, 500);
  }).catch(error => { ElMessage.error("上传失败!" + error); })
  return false;
}

const userInfoSave = () => {
  isLoading.value = true;
  root.info(InfoEdit.value).then(res => {
    setTimeout(() => {
      isEdit.value = !isEdit.value;
      ElMessage.success("修改信息成功");
      const user = res.data.data;
      User.setUser({
        username: user.username,
        label: user.label,
        avatar: user.avatar,
        role: {
          id: user.role.id,
          name: user.role.name
        }
      });
      InfoEdit.value.username = user.username;
      InfoEdit.value.avatar = user.avatar;
      isLoading.value = false;
    }, 500);
  }).catch(error => ElMessage.error(error))
}

onMounted(() => {
  isEdit.value = false;
})
</script>
  
<style lang="scss" scoped></style>