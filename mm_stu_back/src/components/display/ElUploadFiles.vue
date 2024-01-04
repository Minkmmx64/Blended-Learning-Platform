<template>
  <div class="upload-file flex-column flex-cente">
    <el-upload
        class="upload-demo"
        drag
        :before-upload="beforeUpload"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
    </el-upload>
    <div v-if="rawFiles.File" class="upload-file-item flex-column flex-center">
      <div class="item mt-5 pr-10 pl-10 flex-row flex-between flex-alg">
        <el-tag class="mx-1" size="large">文件名:</el-tag>
        <span class="select-none"> {{ rawFiles.File?.name }}</span>
      </div>
      <div class="item mt-5 pr-10 pl-10 flex-row flex-between flex-alg">
        <el-tag class="mx-1" size="large">文件大小:</el-tag>
        <span class="select-none"> {{ fileSize }} MB</span>
      </div>
      <div class="item mt-5 pr-10 pl-10 flex-row flex-between flex-alg">
        <el-tag class="mx-1" size="large">上传进度:</el-tag>
        <el-progress class="ml-5 progress" :percentage="rawFiles.progress ?? 0" />
      </div>
      <div class=" mt-5 pr-10 pl-10 flex-row flex-between flex-alg">
        <el-button @click="upload" :loading="loading.uploading" class="mt-20" type="success">上传资源</el-button>
        <el-button v-if="rawFiles.progress" class="mt-20" :loading="loading.deloading" type="danger">暂停上传</el-button>
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
        <el-tag class="mx-1 mr-10" size="large" type="danger">文件路径:</el-tag>
      </div>
      <div class="flex-row mt-10 flex-alg flex-between w-full">
        <el-tag class="mx-1 ml-10" size="large">文件类型:</el-tag>
        <el-tag class="mx-1 mr-10" size="large" type="danger">文件类型:</el-tag>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { UploadRawFile } from "element-plus";
import {computed, ref} from "vue";
import { useElUploadFiles } from "./useElUploadFiles";
import { UploadFilled } from '@element-plus/icons-vue'

const initRawFiles : IUploadRawFile = {
  File: null,
  progress: undefined,
  ok: false,
  md5: "",
  time: undefined,
  md5progress: 0
}

interface IUploadRawFile {
  File: UploadRawFile | null;
  progress: number | undefined;
  ok: boolean;
  md5: string;
  time: number | undefined;
  md5progress: number;
}

const rawFiles = ref<IUploadRawFile>(initRawFiles);

const loading = ref<Record<string, boolean>>({
  uploading: false,
  deloading: false
});

const fileSize = computed(() => {
  if(rawFiles.value.File) {
    return (rawFiles.value.File.size / 1024 / 1024).toFixed(2);
  }else return 0;
})

const beforeUpload = (rawFile: UploadRawFile) => {
  rawFiles.value.File = null;
  setTimeout(() => {
    rawFiles.value.File = rawFile;
  }, 0)
  return false;
}

const upload = () => {

  useElUploadFiles(rawFiles.value.File, {
    chunk: 1000,
    onprogress(v) {
      rawFiles.value.progress = v;
    },
    oncalcmd5({ md5, time }) {
      rawFiles.value.md5 = md5, rawFiles.value.time = time;
    },
    oncalcmd5progress(e) {
      if(typeof e === "string") e = parseFloat(e);
      rawFiles.value.md5progress = e;
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
.upload-file-item, .upload-file-ok{
  animation: file-upload-show 500ms ease;
}
.upload-file /deep/ .el-upload-list {
  margin: 0 !important;
}
.upload-file-item .item {
  width: 500px;
  height: 60px;
  border: 1px solid #007aff;
  border-radius: 5px;
  box-sizing: border-box;
}
.progress {
  width: 500px;
}
.upload-file-ok {
  width: 500px;
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