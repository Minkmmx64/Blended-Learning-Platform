<template>
  <div class="main flex-row" v-if="teacher_user.getUser.teacher">
    <!-- 选择签到班级 -->
    <el-menu
      active-text-color="#2563EB"
      :background-color="config.MenuBackColor"
      class="scroll"
      text-color="#fff"
      :default-active="null"
      :unique-opened="!true"
      :collapse-transition="true"
      :style="{ height: '100vh', padding: '0px 0px 0px 0px', width: '240px', zIndex: 100 }"
      @select="selectClass"
    >
      <MainSystemMenu :data="classList" />
    </el-menu>
    <!-- 选择签到课程 -->
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
      v-if="currentSelectCourse" 
      class="content flex-column relative">
      <!-- 发起签到 -->
      <div class="send-sign pl-5 pt-5 border-info shadow-info flex-column">
        <div class="mt-5 mb-5 select-none">{{ getClass }} - {{ getCourse }} 课</div>
        <SendSignOptions 
          :name="`${getClass},${getCourse}`"
          @sign="handleSign"
        />
      </div>
      <!-- 签到信息 -->
      <div class="sign-stu scroll">
        
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import MainSystemMenu from '@/components/System/child/MainSystemMenu.vue';
import { config } from "@/components/System/AdminSystemLayout";
import { ElMessage, MenuItemClicked } from "element-plus";
import { NavigationFailure } from "vue-router";
import teacher, { menu } from '@/Request/ApiModules/teacher';
import stu from '@/Request/ApiModules/stu';
import { useUserStore } from '@/store/index'
import SendSignOptions from "./SendSignOptions.vue";
import { ISignOptions } from ".";

const teacher_user = useUserStore();

const mapProp = ref(new Map<string, { name: string, courses: menu[]}>());

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

// 获取课程名称
const getCourse = computed(() => {
  return mapProp.value.get(currentSelectClass.value).courses.find(v => v.key === currentSelectCourse.value).name;
})
// 获取班级名称
const getClass = computed(() => {
  return mapProp.value.get(currentSelectClass.value).name;
})

const loadStudentClassInfo = async (classId: number) => {
  const { data } = (await stu.getStudentInfoClass(classId)).data;

  console.log(data);
}


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

  loadStudentClassInfo(+ key);
}

/**
 * 选中课程，查看该班级该课程该教师的信息
 */
const selectCourse = (key: string, indexPath: string[], item: MenuItemClicked, routerResult?: Promise<void | NavigationFailure>) => {
  currentSelectCourse.value = key;
  console.log(currentSelectClass.value, key);
}

/**
 * 发起签到
 */
const handleSign = (value: ISignOptions) => {
  console.log(value);
  ElMessage.info("正在发起签到...");
  
}

onMounted(() => {
  if(!teacher_user.getUser.teacher) {
    ElMessage.error("您不是教师");
    return;
  }
  loadTeacherClassGroup();
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
.sign-stu { flex: 0.75; }
</style>