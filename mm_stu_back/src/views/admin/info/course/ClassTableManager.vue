<template>
  <div class="w-full h-full mb-40">
    <div class="TableHead">
      <el-row class="mb-10 mt-10" :gutter="20">
        <el-col :span="12">
          <el-select
            v-model="QueryParams.class_id"
            class="m-2"
            placeholder="select class"
          >
            <el-option
              v-for="item in Classes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :span="12">
          <div class="grid-content ep-bg-purple-dark">
            <el-button
              type="success"
              @click="handleQuery"
            >
              查询班级课表
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog v-model="isEdit" title="安排课程" width="30%">
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>选择教师:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-select
            v-model="EditParams.teacher_id"
            class="m-2"
            placeholder="select teaher"
          >
            <el-option
              v-for="item in Teachers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isEdit = false">取消</el-button>
          <el-button type="primary"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <div class="course-table-container scroll">
      <table class="course-table-container-table flex-column w-full">
        <tr align="center" class="course-table-container-tr flex-row w-full">
          <td class="course-table-container-td border-info h-full" v-for="(item, index) in day" :key="index"> {{ item }}
          </td>
        </tr>
        <template v-for="(item, index) in time" :key="index">
          <tr align="center" class="course-table-container-item-tr flex-row w-full">
            <template v-if="(typeof item === 'number')">
              <template v-for="(d, dindex) in day" :key="dindex">
                <td 
                  :class="'course-table-container-item-td select-none h-full ' + (dindex !== 0 ? 'course-table-container-item-td-hover point' : '')"
                  @click="SelectClassTablePosition(index, dindex)"
                >
                  <span v-if="dindex === 0">{{ item }} </span>
                  <span v-else>{{ readPosition(index, dindex) }}</span>
                </td>
              </template>
            </template>
            <template v-else>
              <td class="course-table-container-blank-td select-none" :rowspan="day.length">{{ item }}</td>
            </template>
          </tr>
        </template>
      </table>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import classes from "@/Request/ApiModules/class";
import teacher from "@/Request/ApiModules/teacher";
import { ElMessage } from "element-plus";

const day = ["    ", "一", "二", "三", "四", "五", "六", "日"];
const time = [1, 2, 3, 4, 5, "中午", 6, 7, 8, 9, "晚上", 10, 11, 12];
const isEdit = ref(false);

const SelectClassTablePosition = (x: number, y: number) => {
  if (y == 0) return;
  isEdit.value = true;
}

const readPosition = (x: number, y: number) => {
  
}

const handleQuery = () => {
  classes.classTable(QueryParams.value.class_id).then( res => {
    ClassCourseTable.value = res.data.data;
  }).catch( error => ElMessage.error(error));
}

// 班级列表
const Classes = ref([]);
// 教师列表
const Teachers = ref([]);
// 课程列表
const ClassCourseTable = ref();

const loadColleges = () => {
  classes.all().then( res => {
    Classes.value = res.data.data;
  }).catch( error => ElMessage.error(error));
}

const loadTeacher = () => {
  teacher.all().then( res => {
    Teachers.value = res.data.data;
  }).catch( error => ElMessage.error(error));
}

watch(
  () => [EditParams.value.teacher_id],
  () => {

  }
)

const QueryParams = ref({
  class_id: undefined
})
const EditParams = ref({
  teacher_id: undefined,
  course_id: undefined
})

onMounted(() => {
  loadColleges();
  loadTeacher();
})
</script>
  
<style lang="scss" scoped>
.course-table-container {
  width: 60%;
  height: 700px;
  margin: 0 auto;
  .course-table-container-table {
    .course-table-container-item-tr {
      .course-table-container-item-td {
        width: calc(100% / 8);
        height: 80px;
        line-height: 80px;
        border: 1px solid $info;
        transition: 500ms all ease;

        +.course-table-container-item-td-hover {
          &:hover {
            border-color: $primary;
          }
        }
      }

      .course-table-container-blank-td {
        width: 100%;
        height: 40px;
        line-height: 40px;
      }
    }
  }
}

.course-table-container-tr {
  height: 40px;
  .course-table-container-td {
    width: calc(100% / 8);
    line-height: 40px;
  }
}
</style>