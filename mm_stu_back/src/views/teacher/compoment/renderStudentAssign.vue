<template>
  <!-- 加载该考试的学生提交情况列表 -->
  <div class="h-full">
    <IconFont
      class="mr-4 point"
      icon="back1"
      @click="Emit('back')"
    />
    <div class="flex-row h-full w-full" style="gap: 20px;">
      <ul class="scroll h-full" style="height: calc(100% - 100px);">
        <li 
          @click="toggleSelectStudent(index, item)"
          :class="['student-list-item', 'point border-info', 'flex-row', 'flex-center', 'mt-5', getStyle(index) ]" v-for="(item ,index) in studentLists" :key="index">
          {{ item.exam_status }} - {{ item.student.name }}
        </li>
      </ul>
      <div v-if="currentSelectStudent && currentSelectStudent.exam_status === ExamStatus.waiting" style="flex: 1; display: flex ;flex-direction: column; align-items: center;">
        <!-- 题目列表 -->
        <div class="flex-row" style="gap: 20px">
          <div 
            @click="changeCurrentShowSubject(index)" 
            :class="['list-number', 'point', (index + 1) === currentSelectSubjectNumber ? 'list-number-select' : '']" 
            v-for="(item, index) in paperLists" :key="index">
            {{  index + 1 }}
          </div>
        </div>
        <ShowSubjectProp 
          v-if="paperLists.length" 
          :number="currentSelectSubjectNumber ?? 1" 
          :data="currentSelectSubject ?? paperLists[0]" />
        <template v-if="paperLists.length" >
          <el-tag class="mt-10" type="primary">参考答案: {{ currentSelectSubject.result }}</el-tag>
        </template>
        <template v-if="currentStudentAnswer">
          <el-tag class="mt-10" type="success">学生答案: {{ currentStudentAnswer.result }}</el-tag>
          <el-form 
            ref="formRef"
            :rules="rules"
            :model="currentJudgeRes" 
            label-width="auto" 
            style="max-width: 600px">
            <ElRow class="mt-10" style="width: 400px;justify-content: space-around;">
              <el-form-item label="教师评语" prop="comment">
                <ElInput :type="'text'" v-model="currentJudgeRes.comment" style="width: 200px"/>
              </el-form-item>
            </ElRow>
            <ElRow class="mt-10" style="width: 400px;justify-content: space-around;">
              <el-form-item label="最终得分" prop="value">
                <ElInputNumber v-model="currentJudgeRes.value" style="width: 200px"/>
              </el-form-item>
            </ElRow>
          </el-form>
          <ElRow class="mt-10" style="width: 400px;justify-content: space-around;">
            <ElButton type="primary" @click="uploadRes(formRef)">上传结果</ElButton>
          </ElRow>
        </template>
        <template v-else>
          <el-tag class="mt-10" type="danger">该学生未作答</el-tag>
        </template>
        <div class="flex-row w-full mt-50" style="justify-content: space-around;">
          <ElButton type="warning" @click="chagePage(-1)">上一页</ElButton>
          <ElButton type="info" @click="submitExam">提交试卷</ElButton>
          <ElButton type="warning" @click="chagePage(1)">下一页</ElButton>
        </div>
      </div>
      <div style="flex: 1; display: flex ;flex-direction: column; align-items: center;" v-else>
        该学生未交卷
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from "vue";
import Exam, { AnswerResult, ExamStatus, IgetStudentExamInfo }  from '@/Request/ApiModules/exam';
import { ISubjectProps } from "@/Request/ApiModules/subject";
import Paper from "@/Request/ApiModules/paper";
import ShowSubjectProp from "@/views/subject/component/ShowSubjectProp.vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";

interface IProps {
  examId: number;
  paper: number;
}
interface IEmit {
  (event: 'back') : void;
}

const Emit = defineEmits<IEmit>();

const Props = defineProps<IProps>();

const studentLists = ref<IgetStudentExamInfo[]>([]);
const paperLists = ref<ISubjectProps[]>([]);
const currentSelectSubjectNumber = ref<undefined | number>(1);
const currentSelectSubject = ref<ISubjectProps>();
const currentSelectStudent = ref<IgetStudentExamInfo>();
const currentJudgeRes = ref({
  comment: "",
  value: undefined
});

const activateIndex = ref(-1);

const getStyle = computed(() => (index: number) => activateIndex.value === index ? 'student-list-item-celect' : '');

const currentStudentAnswer = ref<AnswerResult>();

const loadStudentLists = async () => {
  const { data } = await Exam.getStudentExamInfo(Props.examId);
  studentLists.value = data.data;
}

const loadPaperSubjecLists = async () => {
  const { data } = await Paper.getRelaPaperSubjects(Props.paper);
  paperLists.value = data.data;
  currentSelectSubject.value = paperLists.value[0];
}

const changeCurrentShowSubject = (idx: number) => {
  currentSelectSubject.value = paperLists.value[idx];
  currentSelectSubjectNumber.value = idx + 1;
}

const toggleSelectStudent = (index: number, val: IgetStudentExamInfo) => {
  activateIndex.value = index;
  currentSelectStudent.value = val;
}

const chagePage = (val: number) => {
  if(currentSelectSubjectNumber.value + val < 1 || currentSelectSubjectNumber.value + val > paperLists.value.length) return;
  currentSelectSubjectNumber.value = currentSelectSubjectNumber.value + val;
  currentSelectSubject.value = paperLists.value[currentSelectSubjectNumber.value - 1];
}

const formRef = ref<FormInstance>();

const rules = reactive<FormRules<typeof currentJudgeRes>>({
  value: [
    { required: true , message: "请输入得分", trigger: "blur" },
    { type: 'number', min: 0 }
  ],
  comment: [
    { required: true , message: "请输入评语", trigger: "blur" },
  ]
});

const uploadRes = (form?: FormInstance) => {
  if (!form) return
  form.validate((valid) => {
    if (valid) {
      const { examId, studentId, subjectId } = getId.value;
      Exam.postStudentAnswer(studentId, examId, subjectId, { comment: currentJudgeRes.value.comment, ultimate: currentJudgeRes.value.value })
          .then(() => ElMessage.success("上传成功"))
          .catch(() => ElMessage.success("上传失败"))
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const getId = computed(() => {
  const examId = Props.examId;
  const studentId = currentSelectStudent.value.student.id;
  const subjectId = currentSelectSubject.value.id;
  return {
    examId: examId,
    studentId: studentId,
    subjectId: subjectId
  }
});

const submitExam = async () => {
  const { studentId, examId } = getId.value;
  await Exam.submitStudentExamSuccess(studentId, examId);
  ElMessage.success("上传学生答案成功");
  Emit("back");
}

watchEffect(() => {
  if(Props.examId && Props.paper) {
    // 获取学生答题情况
    loadStudentLists();
    // 获取该考试的试卷题目列表
    loadPaperSubjecLists();
  }
});

watchEffect( async () => {
  // 加载学生答题情况
  if(currentSelectStudent.value?.student && currentSelectSubject.value?.id && Props.examId){    
    if(currentSelectStudent.value?.exam_status === ExamStatus.waiting){
      const { examId, studentId, subjectId } = getId.value;
      const { data } = await Exam.getStudentSubject(studentId, examId, subjectId);
      currentStudentAnswer.value = data.data;
      if(data.data){
        currentJudgeRes.value.value = currentStudentAnswer.value.ultimate;
        currentJudgeRes.value.comment = currentStudentAnswer.value.teacher_comment;
      }
    }
  }
})

</script>
  
<style lang="scss" scoped>
  .student-list-item{
    width: 200px;
    height: 40px;
    transition: all ease 300ms;
    &:hover { border-color: #007aff; }
  }
  .student-list-item-celect {
    border-color: rgba(24, 220, 255,1.0);
    background-color: #007aff;
    color: #ffffff;
  }
  .list-number{
    transition: all ease 300ms;
    width: 40px;
    height: 40px;
    background-color: #007aff;
    color: #ffffff;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
  }
  .list-number-select {
    background-color: rgb(103,194,58);
  }
</style>