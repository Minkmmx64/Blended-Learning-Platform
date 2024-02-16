<template>
  <div class="w-full h-full flex-row ">
    <el-radio-group v-model="SignOptions.signType" class="ml-4" style="width: 150px;">
      <el-radio class="w-full" :label="Sign.Gestures" size="large">{{ Sign.Gestures }}</el-radio>
      <el-radio class="w-full" :label="Sign.QRcode" size="large">{{ Sign.QRcode }}</el-radio>
      <el-radio class="w-full" :label="Sign.Online" size="large">{{ Sign.Online }}</el-radio>
    </el-radio-group>
    <div 
      class="flex-column flex-center mr-20"
      v-if="SignOptions.signType === Sign.Gestures">
      <ElButton type="warning" @click="show = true">设置手势</ElButton>
      <ElTag v-if="SignOptions.SignCipher" class="mt-10 select-none"  type="success"> {{ SignOptions.SignCipher }} </ElTag>
    </div>
    <div class="flex-column flex-center">
      <div style="color: #007aff;">签到时长:</div>
      <div class="mt-10">
        <ElInputNumber v-model="SignOptions.SignDuration" :max="60" :min="0" /><span style="color: #34D399;">&nbsp;&nbsp;分钟</span>
      </div>
    </div>
    <div class="flex-column flex-center ml-20" style="width: 280px;">
      <div style="color: #007aff;">签到标题:</div>
      <div class="mt-10 w-full">
        <el-input 
          :rows="2"
          type="textarea" 
          resize="none"
          v-model="SignOptions.SignTitle" />
      </div>
    </div>
    <div class="h-full flex-row flex-alg-end ml-20 pb-2 border-box" style="width: 250px;">
      <ElButton type="success" @click="showGesturesSign">发起签到</ElButton>
    </div>
  </div>
  <ElDialog 
    :width="400"
    title="设置手势"
    v-model="show" 
    style="z-index: 10000;">
    <GesturesSign @ok="getGesturesSignCipher"/>
  </ElDialog>
</template>
  
<script setup lang="ts">
import GesturesSign from '@/components/display/GesturesSign/GesturesSign.vue';
import { ElMessage } from 'element-plus';
import { reactive, ref, watch } from "vue";
import { ISignOptions, Sign } from '.';

interface IProps {
  name: string;
}

interface Emit {
  (event: 'sign', value: ISignOptions) : void;
}
const Props = withDefaults(
  defineProps<IProps>(),
  {
    name: ""
  }
)
const emit = defineEmits<Emit>();

const show = ref(false);

watch(
  () => [Props.name],
  () => {
    SignOptions.SignTitle = Props.name
  }
)

const SignOptions = reactive({
  signType: Sign.Gestures,
  SignDuration: 0,
  SignTitle: Props.name,
  SignCipher: ""
})

const getGesturesSignCipher = (value: number[]) => {
  console.log(value.join(""));
  SignOptions.SignCipher = value.join("");
  show.value = false;
}

const showGesturesSign = () => {
  if(SignOptions.signType === Sign.Gestures && !SignOptions.SignCipher) return ElMessage.error("请设置签到手势");
  if(!SignOptions.SignDuration) return ElMessage.error("请设置签到时长");
  if(!SignOptions.SignTitle) {
    return ElMessage.error("请设置签到名称");
  }
  emit("sign", SignOptions);
}

</script>