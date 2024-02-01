<template>
  <div>TeacherClassCoursesManager</div>
</template>

<script lang="ts" setup>
import teacher from "@/Request/ApiModules/teacher";
import { useUserStore } from "@/store/index";
import {onMounted} from "vue";
import { ElMessage } from "element-plus";
const teacherUser = useUserStore();
onMounted(( async () => {
  const teacherId = teacherUser.User?.teacher?.id;
  if(teacherId && teacherId != -1) {
    const data = await teacher.getTeacherClassCourseTablesInfo(teacherId);
    console.log(data.data.data);
  }else ElMessage.error("您不是教师!");
}));
</script>

<style lang="scss" scoped>

</style>