<template>
  <div class="main flex-row" v-if="teacher_user.getUser.teacher">
    <!-- 选择班级 -->
    <el-menu
        active-text-color="#2563EB"
        :background-color="config.MenuBackColor"
        class="scroll"
        text-color="#fff"
        :default-active="null"
        :unique-opened="!true"
        :collapse-transition="true"
        :style="{ height: '100vh', padding: '0px 0px 0px 0px', width: '240px', zIndex: 100, marginLeft: '-40px' }"
        @select="selectClass"
    >
      <MainSystemMenu :data="classList" />
    </el-menu>
    <!-- 选择课程 -->
    <el-menu
        v-if="currentSelectClass"
        active-text-color="#2563EB"
        :background-color="config.MenuBackColor"
        class="scroll move-in"
        text-color="#fff"
        :default-active="null"
        :unique-opened="!true"
        :collapse-transition="true"
        :style="{ height: '100vh', padding: '0px 0px 0px 0px', width: '200px' }"
        @select="selectCourse"
    >
      <MainSystemMenu :data="courseList" />
    </el-menu>
    <!-- 内容区 -->
    <div
        v-loading="isLoadingStudent"
        v-if="currentSelectCourse"
        class="content flex-column relative pl-20">
        <el-row :gutter="20">
          <el-col class="mt-20">
            设置作业标题:
          </el-col>
          <el-col class="mt-10">
            <el-input v-model="createExam.name" placeholder="输入标题" style="width: 300px" />
          </el-col>
          <el-col class="mt-20">
            选择试卷:
          </el-col>
          <el-col class="mt-10">
            <SelectPaper
              :loading="TableLoading"
              :DataSource="DataSource"
              :total="total"
              @handleCurrentChange="TableProps.handleCurrentChange"
              @refresh="TableProps.loadTableDatas"
              @query="TableProps.loadTableDatas"
              @reset="TableProps.handleClearQuery"
              v-model:selectValue="createExam.paperId"
            >
              <template #header >
                <el-input v-model="QueryParams.name" placeholder="试卷名称" style="width: 150px;"/>
                <el-input v-model="QueryParams.classify" class="ml-20" placeholder="试卷分类" style="width: 150px;"/>
              </template>
            </SelectPaper>
          </el-col>
          <el-col class="mt-20">
            设置作业结束日期:
          </el-col>
          <el-col class="mt-10">
            <el-date-picker
                v-model="createExam.time"
                type="datetime"
                placeholder="Select date and time"
            />
          </el-col>
          <el-col class="mt-20">
            <el-button @click="sendCreateExam" type="danger" size="large">发布作业</el-button>
          </el-col>
        </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import MainSystemMenu from '@/components/System/child/MainSystemMenu.vue';
import { config } from "@/components/System/AdminSystemLayout";
import { ElMessage, MenuItemClicked } from "element-plus";
import { NavigationFailure } from "vue-router";
import teacher, { menu } from '@/Request/ApiModules/teacher';
import stu, { Student } from '@/Request/ApiModules/stu';
import { useUserStore, useWebSocketStore } from '@/store/index';
import Exam ,{ IExam } from '@/Request/ApiModules/exam';
import { paper } from '@/Request/ApiModules/paper';
import SelectPaper from "@/components/display/table/SelectWithTable.vue";
import {useTableFunction} from "@/components/TableFunction/useTableFunction";

const teacher_user = useUserStore();

const ws = useWebSocketStore();

const createExam: IExam = reactive({
  name: "",
  time: "",
  paperId: "",
  courseId: "",
  classId: "",
  teacherId: undefined
})

const mapProp = ref(new Map<string, { name: string, courses: menu[]}>());

//获取教师所担任的班级以及对应课程
const loadTeacherClassGroup = async () => {
  const data = await teacher.getTeacherClassGroup(teacher_user.getUser.teacher.id)
  classList.value = data.data.data.map( v => {
    mapProp.value.set(v.class.key.toString(), { name: v.class.name, courses: v.class.courses });
    v.class.courses.forEach( c => c.key = c.key.toString() );
    return {
      key: v.class.key.toString(),
      name: v.class.name
    }
  });
}

// 获取该班级学生
const loadStudentClassInfo = async (classId: number) => {
  isLoadingStudent.value = true;
  setTimeout( async () => {
    const { data } = (await stu.getStudentInfoClass(classId)).data;
    currentStudent.value = data;
    isLoadingStudent.value = false;
  }, 500);
}
//当前学生
const currentStudent = ref<Student[]>([]);
//加载学生
const isLoadingStudent = ref(false);
//当前选中班级
const currentSelectClass = ref("");
//当前选中课程
const currentSelectCourse = ref("");
//当前班级列表
const classList = ref([]);
//当前课程列表
const courseList = ref([]);

/**
 * 获取教师的班级
 * 获取教师的课程
 */

const selectClass = async (key: string, indexPath: string[], item: MenuItemClicked, routerResult?: Promise<void | NavigationFailure>) => {
  currentSelectClass.value = "";
  currentSelectCourse.value = "";
  setTimeout(() => {
    currentSelectClass.value = key;
  }, 0);
  courseList.value = mapProp.value.get(key).courses;

}

/**
 * 选中课程，查看该班级该课程该教师的信息
 */
const selectCourse = async (key: string, indexPath: string[], item: MenuItemClicked, routerResult?: Promise<void | NavigationFailure>) => {
  currentSelectCourse.value = key;
  await loadStudentClassInfo(+ currentSelectClass.value);
}

const QueryParams = ref({
  name: "",
  classify: ""
});

const TableProps = useTableFunction<paper>(
    "试卷",
    paper,
    QueryParams,
    undefined,
    undefined,
    undefined,
);

const { DataSource, TableLoading, total } = TableProps;

const sendCreateExam = async () => {
  createExam.courseId = currentSelectCourse.value;
  createExam.classId = currentSelectClass.value;
  createExam.teacherId = teacher_user.getUser.teacher.id;
  // 发布考试， 发布成功通知学生进行考试
 try {
   await Exam.create(createExam);
   ElMessage.success('作业发布成功');

   // 通知学生有作业
   ws.getInstance.emit("SEND_EXAM", createExam);


   for(const k in createExam) createExam[k] = "";
 } catch (e) {
   ElMessage.error(e);
 }
}

onMounted(() => {
  if(!teacher_user.getUser.teacher) {
    ElMessage.error("您不是教师");
  } else {
    loadTeacherClassGroup();
  }

  TableProps.loadTableDatas();
})

</script>

<style lang="css" scoped>
.move-in { animation: movein 400ms ease-in-out; }
@keyframes movein {
  0% {
    transform: translateX(-20px);
    opacity: 0.5;
  }
  100% {
    transform: translateX(0px);
    opacity: 1;
  }
}
.main /deep/ .el-menu { border: none; }
.content { flex: 1; max-height: calc(100vh - 110px); animation: movein 400ms ease-in-out; }
.send-sign { flex: 0.25; }
.sign-stu { flex: 0.75; flex-wrap: wrap; gap: 20px }
</style>