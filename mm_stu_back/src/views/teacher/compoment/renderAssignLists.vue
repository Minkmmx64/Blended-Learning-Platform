<template>
  <div class="scroll" style="max-height: calc(100vh - 100px);">
    <ul class="flex-row">
      <li
        class="flex-column border-info point pl-6 pt-4 pb-4 flex-alg pr-6 shadow-info select-none" 
        @click="Emit('toogleAssign', item.exam_id, item.paper_id)"
        v-for="(item, index) in assigns" :key="index">
        <div class="mt-4">{{  item.exam_name }}</div>
        <el-tag class="mt-4" type="primary" style="align-self: flex-end;">{{  item.course_name }}</el-tag>
        <el-tag class="mt-4" type="success" style="align-self: flex-end;">{{  item.class_name }}</el-tag>
        <div class="mt-4" style="align-self: flex-end;">
          {{ + item.successful + + item.waiting }} / {{ + item.uncommitted + + item.successful + + item.waiting }}
        </div>
      </li>
    </ul>
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from '@/store/index';
import Exam, { AssignGroup }  from '@/Request/ApiModules/exam';

const teacher = useUserStore();

const assigns = ref<AssignGroup[]>([]);

interface IEmit {
  (event: "toogleAssign", val: number, val2: number) : void;
}

const Emit = defineEmits<IEmit>();

onMounted( async () => {
  if(teacher.getUser.teacher.id){
    const { data } = await Exam.getAssign(teacher.getUser.teacher.id);
    assigns.value = data.data
  }
})
</script>
  
<style lang="scss" scoped>
  ul > li { width: 250px; }
  ul { gap: 20px; flex-wrap: wrap; }
</style>