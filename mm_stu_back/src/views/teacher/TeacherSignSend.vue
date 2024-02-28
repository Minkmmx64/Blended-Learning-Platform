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
      v-loading="isLoadingStudent"
      v-if="currentSelectCourse" 
      class="content flex-column relative">
      <!-- 发起签到 -->
      <div class="send-sign pl-5 pt-5 border-info shadow-info flex-column">
        <div class="mt-5 mb-5 select-none">{{ getClass }} - {{ getCourse }} 课</div>
        <SendSignOptions
          v-if="!currentIsSign" 
          :name="`${getClass},${getCourse}`"
          @sign="handleSign"
        />
        <div v-else>
          当前签到还剩 {{ currentSignDuration }}
        </div>
      </div>
      <!-- 签到信息 -->
      <template v-if="currentIsSign">
        <div 
          class="sign-stu scroll flex-row">
          <renderStuSign 
            v-for="(item, index) in currentStudent" :key="item.id" 
            :student="item"
            :signId="signId"
          />
        </div>
      </template>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import renderStuSign from './compoment/renderStuSign.vue'
import { computed, onMounted, ref } from "vue";
import MainSystemMenu from '@/components/System/child/MainSystemMenu.vue';
import { config } from "@/components/System/AdminSystemLayout";
import { ElMessage, MenuItemClicked } from "element-plus";
import { NavigationFailure } from "vue-router";
import teacher, { menu } from '@/Request/ApiModules/teacher';
import stu, { Student } from '@/Request/ApiModules/stu';
import { useUserStore, useWebSocketStore } from '@/store/index'
import SendSignOptions from "./SendSignOptions.vue";
import { ISignOptions } from ".";
import sign, { SignBase, SignCreate } from '@/Request/ApiModules/sign';

const teacher_user = useUserStore();
const ws = useWebSocketStore();

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
// 当前发起签到Id
const signId = ref(0);
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
//当前是否有签到工作
const currentIsSign = ref(false);
//当前签到倒计时
const currentSignDuration = ref(0);
/**
 * 选中课程，查看该班级该课程该教师的信息
 */
const selectCourse = async (key: string, indexPath: string[], item: MenuItemClicked, routerResult?: Promise<void | NavigationFailure>) => {
  currentSelectCourse.value = key;
  
  const data = await sign.getTTL(getSignInfo.value);
  const ttl = data.data.data.ttl;
  const sign_id = data.data.data.id;
  
  signId.value = sign_id;

  loadStudentClassInfo(+ currentSelectClass.value);

  // 获取当前签到的id, 后续根据 签到id - 学生id 获取当前是否签到成功
  //console.log(sign_id);

  if(ttl > 0) {
    // 还在签到
    currentIsSign.value = true;

    currentSignDuration.value = ttl;

  } else {
    currentIsSign.value = false;
  }
}

/**
 * 获取当前签到课程信息
 */
const getSignInfo = computed((): SignBase => {
  return {
    classId: parseInt(currentSelectClass.value),
    courseId: parseInt(currentSelectCourse.value),
    teacherId: teacher_user.getUser.teacher.id
  }
})

/**
 * 发起签到
 */
const handleSign = (value: ISignOptions) => {

  const SignCreate: SignCreate = {
    SignCipher: value.SignCipher,
    SignDuration: value.SignDuration,
    SignTitle: value.SignTitle,
    SignType: value.signType,
    classId: parseInt(currentSelectClass.value),
    courseId: parseInt(currentSelectCourse.value),
    teacherId: teacher_user.getUser.teacher.id
  }
  sign.create(SignCreate).then( async (res) => {
    ElMessage.info("正在发起签到...");
    /**
     * 去通知该班级学生提示签到
     */
    ws.getInstance.emit("SEND_SIGN", { ...SignCreate, SignId: res.data.data });
    currentIsSign.value = true;
    signId.value = res.data.data;
    currentSignDuration.value = 60 * SignCreate.SignDuration;
    
  }).catch( err => {
    ElMessage.error("发起签到失败" + err);
  });
}

onMounted(() => {
  if(!teacher_user.getUser.teacher) {
    ElMessage.error("您不是教师");
    return;
  }

  loadTeacherClassGroup();

  const T = setInterval(() => {
    if(currentSignDuration.value >= 1)
      currentSignDuration.value = currentSignDuration.value - 1;
    else {
      currentIsSign.value = false;
      //clearInterval(T);
    }
  }, 1000);
  
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