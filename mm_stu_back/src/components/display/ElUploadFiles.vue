<template>
  <div class="upload-file flex-row flex-center h-full">
    <el-upload
        ref="uploadRef"
        class="upload-demo"
        :before-upload="useElUploadFile"
    >
      <el-button class="h-full" type="primary">上传资源</el-button>
    </el-upload>
    <div class="upload-file-item h-full ml-20" v-if="file.name">
      文件名 : {{ file.name }} <br/>
      文件大小: {{ (file.size / 1024.0 / 1024.0).toFixed(2) }}MB
    </div>
    <el-button @click="upload" class="h-full ml-10" v-if="file.name" type="success">开始上传</el-button>
    <progress class="ml-20" :value="uploadEvent.progress" style="width: 100px;height: 5px; background-color:red;" />
    {{ uploadEvent.progress }}
  </div>
</template>

<script lang="ts" setup>
import { UploadRawFile } from "element-plus";
import { reactive, ref } from "vue";
import { elUploadFiles } from "./ElUploadFiles";

const file = reactive({
  name: "",
  size: 0,
  File: null
});

const uploadEvent = ref({
  progress: undefined,
})

const useElUploadFile = (rawFile: UploadRawFile) => {
  file.name = "";
  file.File = rawFile;
  setTimeout(() => {
    file.name = rawFile.name;
    file.size = rawFile.size;
  }, 0)
  return false;
}

const upload = () => {
  elUploadFiles(file.File, {
    unit : 0.1,
    onprogress(e) {
      uploadEvent.value.progress = e;
    }
  })
}

</script>

<style scoped>
@keyframes file-upload-show {
  0% {
    transform: translateY(100px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
.upload-file-item{
  animation: file-upload-show 500ms ease;
}
.upload-file /deep/ .el-upload-list {
  margin: 0 !important;
}
</style>