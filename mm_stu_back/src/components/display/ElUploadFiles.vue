<template>
  <div class="upload-file flex-column flex-cente">
    <el-upload
        class="upload-demo"
        drag
        :disabled="rawFiles.ok"
        :before-upload="beforeUpload"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
    </el-upload>
    <div v-if="File" class="upload-file-item flex-column flex-center">
      <div class="item mt-5 pr-10 pl-10 flex-row flex-between flex-alg">
        <el-tag class="mx-1" size="large">文件名:</el-tag>
        <span class="select-none"> {{ File.name }}</span>
      </div>
      <div class="item mt-5 pr-10 pl-10 flex-row flex-between flex-alg">
        <el-tag class="mx-1" size="large">文件大小:</el-tag>
        <span class="select-none"> {{ fileSize }} MB</span>
      </div>
      <div class="item mt-5 pr-10 pl-10 flex-row flex-between flex-alg">
        <el-tag class="mx-1" size="large">上传进度:</el-tag>
        <el-progress class="ml-5 progress" :percentage="rawFiles.progress ?? 0" />
      </div>
      <div v-if="!rawFiles.ok" class=" mt-5 pr-10 pl-10 flex-row flex-between flex-alg">
        <el-button @click="useAccessUpload" v-if="isStop" class="mt-20" type="danger">继续上传</el-button>
        <el-button @click="StartUpload" v-else :loading="loading.uploading" class="mt-20" type="success">上传资源</el-button>
        <el-button @click="useStopUpload" v-if="rawFiles.progress" class="mt-20" type="danger">暂停上传</el-button>
      </div>
    </div>

    <div v-if="rawFiles.md5progress" class="upload-file-ok upload-file-calmd5-ok  w-full flex-column flex-center">
      <div class="item pr-10 pl-10 flex-row flex-between flex-alg">
        <el-tag class="mx-1" size="default">计算进度:</el-tag>
        <el-progress class="ml-5 progress" :percentage="rawFiles.md5progress ?? 0" style="width: 200px" />
      </div>
    </div>

    <div v-if="rawFiles.md5" class="upload-file-ok w-full flex-column flex-center">
      <div class="flex-row flex-alg w-full flex-between">
        <el-tag class="mx-1 ml-10" size="large">文件md5:</el-tag>
        <el-tag class="mx-1 mr-10" size="large" type="danger">{{ rawFiles.md5 }}</el-tag>
      </div>
      <div class="flex-row mt-10 flex-alg flex-between w-full">
        <el-tag class="mx-1 ml-10" size="large">计算时间:</el-tag>
        <el-tag class="mx-1 mr-10" size="large" type="danger">{{ rawFiles.time }} ms</el-tag>
      </div>
    </div>

    <div v-if="rawFiles.ok" class="upload-file-ok w-full flex-column flex-center">
      <div class="flex-row flex-alg w-full flex-between">
        <el-tag class="mx-1 ml-10" size="large">文件路径:</el-tag>
        <el-tag class="mx-1 mr-10" size="large" type="danger">{{ rawFiles.url }}</el-tag>
      </div>
      <div class="flex-row mt-10 flex-alg flex-between w-full">
        <el-tag class="mx-1 ml-10" size="large">文件类型:</el-tag>
        <el-tag class="mx-1 mr-10" size="large" type="danger">{{ rawFiles.type }}</el-tag>
      </div>
    </div>
    <el-button style="width: 200px;margin: 0 auto;margin-top: 20px;" v-if="rawFiles.ok" @click="onReload" type="info">重新上传</el-button>
  </div>
</template>

<script lang="ts" setup>
import { UploadRawFile } from "element-plus";
import {computed, ref} from "vue";
import { useElUploadFiles } from "./useElUploadFiles";
import { UploadFilled } from '@element-plus/icons-vue'

const initRawFiles : IUploadRawFile = {
  progress: undefined,
  ok: false,
  md5: "",
  time: undefined,
  md5progress: 0,
  url: "",
  type: ""
}

interface IUploadRawFile {
  progress: number | undefined;
  ok: boolean;
  md5: string;
  time: number | undefined;
  md5progress: number;
  url: string;
  type: string;
}

const getinitRawFiles = () => JSON.parse(JSON.stringify(initRawFiles));

const rawFiles = ref<IUploadRawFile>(getinitRawFiles());
const File = ref<UploadRawFile>();

const fileSize = computed(() => {
  if(File.value) {
    return (File.value.size / 1024 / 1024).toFixed(2);
  }else return 0;
})

const onReload = () => {
  rawFiles.value = getinitRawFiles();
  File.value = null;
}

const beforeUpload = (rawFile: UploadRawFile) => {
  File.value = null;
  setTimeout(() => {
    File.value = rawFile;
  }, 0)
  return false;
}

const { StartUpload, useStopUpload, isStop, useAccessUpload, loading } = useElUploadFiles(File, {
  chunk: 2048,
  onprogress(v) {
    rawFiles.value.progress = v;
  },
  oncalcmd5({ md5, time }) {
    rawFiles.value.md5 = md5, rawFiles.value.time = time;
  },
  oncalcmd5progress(e) {
    if(typeof e === "string") e = parseFloat(e);
    rawFiles.value.md5progress = e;
  },
  onsuccess({ url, type }) {
    rawFiles.value.ok = true;
    rawFiles.value.type = type;
    rawFiles.value.url = url;
  }
});


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
.upload-file-item, .upload-file-ok{
  animation: file-upload-show 500ms ease;
}
.upload-file /deep/ .el-upload-list {
  margin: 0 !important;
}
.upload-file-item .item {
  width: 600px;
  height: 60px;
  border: 1px solid #007aff;
  border-radius: 5px;
  box-sizing: border-box;
}
.progress {
  width: 600px;
}
.upload-file-ok {
  width: 600px;
  height: 100px;
  box-sizing: border-box;
  margin: 0 auto;
  border: 1px solid #007aff;
  border-radius: 5px;
  margin-top: 5px;
}
.upload-file-calmd5-ok{
  height: 50px;
}
</style>