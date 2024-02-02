<template>
  <div>
    <ShowClassTable :courses="Courses" />
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from "vue";
import teacher from "@/Request/ApiModules/teacher";
import { useUserStore } from "@/store/index";
import { ElMessage } from "element-plus";
import ShowClassTable from "@/components/display/ShowClassTable.vue";
import { ICourses, weaks } from "@/components/display/ShowClassTable";
const teacherUser = useUserStore();
const Courses = ref<ICourses[]>([]);

onMounted((() => {
  const teacherId = teacherUser.User?.teacher?.id;
  if (teacherId && teacherId != -1) {
    teacher.getTeacherClassCourseTablesInfo(teacherId).then(data => {
      data.data.data.map( cc => {
        try {
          const arrs = JSON.parse(cc.datejsonarray) as { x: number, y: number }[];
          const dates = arrs.sort((a, b) => {
            if (a.y == b.y) return a.x - b.x;
            return a.y - b.y;
          });
          let row = 1;
          for (let i = 0; i < dates.length; i++) {
            let w = weaks[dates[i].y - 1];
            let t = dates[i].x;
            if ((i < dates.length - 1) && (dates[i + 1].x - 1) === dates[i].x && dates[i + 1].y === dates[i].y) {
              row++;
            }
            else {
              Courses.value.push(({
                weak: w,
                time: t - row + 1,
                rowspan: row,
                teacher: teacherUser.User.teacher.name,
                course: cc.course.name,
                class: cc.class.name
              }));
              row = 1;
            }
          }
        } catch (e) {
          console.error(e);
        }
      });
    });
  } else ElMessage.error("您不是教师!");
}));
</script>
  
<style lang="scss" scoped>
  
</style>