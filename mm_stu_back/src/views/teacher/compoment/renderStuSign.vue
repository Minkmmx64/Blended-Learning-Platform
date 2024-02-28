<template>
  <div class="student-main pt-10 pb-10 border-info mt-5 flex-column flex-alg">
    <img :src="Props.student.user?.avatar ?? Props.student.avatar" />
    <span class="mt-5">{{ Props.student.name }}</span>
    <ElTag v-if="!successful" class="mt-5" :type="'danger'">未签</ElTag>
    <ElTag v-else class="mt-5" :type="'success'" >已签</ElTag>
  </div>
</template>
  
<script setup lang="ts">
import { Student } from "@/Request/ApiModules/stu";
import { onMounted, onUpdated, ref } from "vue";
import sign from '@/Request/ApiModules/sign';
import { ElMessage } from "element-plus";
import { useWebSocketStore } from '@/store/index';

const ws = useWebSocketStore();

const successful = ref(false);
interface IProps {
  student: Student;
  signId: number;
}

const Props = withDefaults(
  defineProps<IProps>(),
  {
    signId: -1
  }
)

onMounted(() => {
  ws.getInstance.on("APP_STUDENT_SIGN", data => {
    console.log("APP_STUDENT_SIGN", data);
  })
});

onUpdated(() => {
  sign.getStudentSignInfo(Props.signId ,Props.student.id)
      .then( res => {
        successful.value = res.data.data.successful;
      })
      .catch( error => ElMessage.error(error));
  
  ws.getInstance.on("RECV_SIGN", ({ id }) => {
    if(id === Props.student.id) successful.value = true;
    
  });
  
})

</script>
  
<style lang="scss" scoped>
  .student-main{
    width: 18%;
    > img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
  }
</style>