<template>
  <div class="w-full h-full mb-40">
    <div class="TableHead">
      <el-row class="mb-10 mt-10" :gutter="20">
        <el-col :span="12">
          <el-select
            v-model="EditParams.class_id"
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
      <el-row class="mb-5 text-center" v-if="EditParams.teacher_id">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>选择课程:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-select
            v-model="EditParams.course_id"
            class="m-2"
            placeholder="select teaher"
          >
            <el-option
              v-for="item in ChooseCourses"
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
          <el-button @click="handCommitClassTable" :loading="isLoading"  type="primary"> 确定 </el-button>
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
                  <span class="flex-column h-full flex-center" v-if="dindex === 0">{{ item }} </span>
                  <tr v-else style="font-size: 14px;" class="flex-column h-full flex-center hidden class-table-show-remove relative">
                    <template v-if="Courses.length && readPosition(index, dindex)">
                      <span>{{ readPosition(index, dindex).course }}</span>
                      <span>{{ readPosition(index, dindex).teacher }}</span>
                      <div @click.stop="removePosition(index, dindex)" class="remove point absolute">x</div>
                    </template>
                  </tr>
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
import course from "@/Request/ApiModules/course";
import teacher from "@/Request/ApiModules/teacher";
import { ElMessage } from "element-plus";

interface Point {
  x: number;
  y: number;
}

interface IClassTable {
  course_id: number;
  teacher_id: number;
}

const day = ["    ", "一", "二", "三", "四", "五", "六", "日"];
const time = [1, 2, 3, 4, 5, "中午", 6, 7, 8, 9, "晚上", 10, 11, 12];
const isEdit = ref(false);
const isLoading = ref(false);
const ClassCourseTableMap = ref(new Map<string, Point[]>());
const ClassCourseTableMapReflect = ref(new Map<string, string>());
// 班级列表
const Classes = ref([]);
// 教师列表
const Teachers = ref([]);
// 选择的课程列表
const ChooseCourses = ref([]);
// 课程列表
const Courses = ref([]);
// 课程表列表
const ClassCourseTable = ref([]);

const EditParams = ref({
  teacher_id: undefined,
  course_id: undefined,
  class_id: undefined,
  jsondata: undefined,
  point: { x: undefined, y: undefined }
})

const SelectClassTablePosition = (x: number, y: number) => {
  if (y == 0) return;
  isEdit.value = true;
  EditParams.value.point.x = x;
  EditParams.value.point.y = y;
  // 获取该时间段的课程信息(如果有)
  const id = { x: EditParams.value.point.x, y: EditParams.value.point.y }
  const class_course_teacher_id = ClassCourseTableMapReflect.value.get(JSON.stringify(id));
  // 点击该时间，如果已经被安排，找出被安排的课程和教师
  if(class_course_teacher_id) {
    const { course_id, teacher_id } = JSON.parse(class_course_teacher_id) as IClassTable;
    EditParams.value.teacher_id = teacher_id;
    setTimeout(() => { EditParams.value.course_id = course_id; }, 0);
  } else {
    EditParams.value.teacher_id = undefined;
    EditParams.value.course_id = undefined;
  }
}

const readPosition = (x: number, y: number) => {
  const id = { x: x, y: y };
  const class_course_teacher_id = ClassCourseTableMapReflect.value.get(JSON.stringify(id));
  if(class_course_teacher_id) {
    const { course_id, teacher_id } = JSON.parse(class_course_teacher_id) as IClassTable;
    const t_name = Teachers.value.find( teacher => teacher.id === teacher_id).name;
    const c_name = Courses.value.find( course => course.id === course_id ).name;
    return { course: c_name, teacher: t_name }
  }
  return undefined;
}

const handleQuery = () => {
  ClassCourseTableMap.value = new Map<string, Point[]>();
  ClassCourseTableMapReflect.value = new Map<string, string>();
  classes.classTable(EditParams.value.class_id).then( res => {
    ElMessage.success("加载课表成功")
    ClassCourseTable.value = res.data.data;
    ClassCourseTable.value.forEach( cls => {  //遍历该班级的所有课程
      try {
        const time = JSON.parse(cls.datejsonarray) as Point[];                //获取课程的安排时间
        const Id = { course_id: cls.course_id, teacher_id: cls.teacher_id };  //获取该课表唯一id
        ClassCourseTableMap.value.set(JSON.stringify(Id), time);              //该课表的安排时间存入映射 [ id => [date] ]
        time.forEach( pos => {                                                //遍历该课程时间的每一项，该课程时间对应的是该课程id
          const posid = { x: pos.x, y: pos.y }
          ClassCourseTableMapReflect.value.set(JSON.stringify(posid), JSON.stringify(Id));
        })
      } catch (error) {
        ElMessage.error("后端数据不按照格式")
      }
    })
  }).catch( error => ElMessage.error(error));
}

const handCommitClassTable = () => {
  if(EditParams.value.course_id && EditParams.value.teacher_id) {
    // console.log(`当前选择班级:${EditParams.value.class_id}设置课程:${EditParams.value.course_id}讲授教师:${EditParams.value.teacher_id}`);
    // console.log(`设置坐标:${EditParams.value.point.x}, ${EditParams.value.point.y}`);
    // 查看当前坐标是否有课程安排
    const id = { x : EditParams.value.point.x, y : EditParams.value.point.y };
    const ClassCourseTableMapId = ClassCourseTableMapReflect.value.get(JSON.stringify(id));
    if(ClassCourseTableMapId) {
      const times = ClassCourseTableMap.value.get(ClassCourseTableMapId);
      if(times instanceof Array) {
        // 当前坐标已经被安排了课程
        // 删除原来课表id中的课程安排时间
        const newtimes = times.filter( pos => (pos.x !== EditParams.value.point.x || pos.y !== EditParams.value.point.y));
        if(newtimes.length)
          ClassCourseTableMap.value.set(ClassCourseTableMapId, newtimes);
        else ClassCourseTableMap.value.delete(ClassCourseTableMapId);
      }
    }
    //获取当前课程_教师的map
    const currentId = { course_id: EditParams.value.course_id, teacher_id: EditParams.value.teacher_id };
    const currentTimes = ClassCourseTableMap.value.get(JSON.stringify(currentId)) ?? [];
    const currentPos = { x: EditParams.value.point.x, y: EditParams.value.point.y }
    if(currentTimes) currentTimes.push(currentPos);
    ClassCourseTableMap.value.set(JSON.stringify(currentId), currentTimes);
    ClassCourseTableMapReflect.value.set(JSON.stringify(currentPos), JSON.stringify(currentId));

    const RequestBody = [];
    ClassCourseTableMap.value.forEach(( value, key ) => {
      const { course_id, teacher_id } = JSON.parse(key) as IClassTable;
      RequestBody.push({ course_id, teacher_id, json: JSON.stringify(value) });
    });
    isLoading.value = true;
    classes.update(EditParams.value.class_id, { list: RequestBody }).then( () => {
     setTimeout(() => {
      ElMessage.success("上传课程表成功");
      isEdit.value = false;
      isLoading.value = false;
     }, 500);
    }).catch(ElMessage.error)
  } else ElMessage.info("请完善");
}

watch(
  () => [EditParams.value.teacher_id],
  () => {
    ChooseCourses.value = (Teachers.value.find( teacher => teacher.id === EditParams.value.teacher_id))?.courses ?? [];
    EditParams.value.course_id = undefined;
  }
)
const loadColleges = () => {
  classes.all().then( res => {
    Classes.value = res.data.data;
  }).catch( error => ElMessage.error(error));
}

const loadCourses = () => {
  course.all().then( res => {
    Courses.value = res.data.data;
  }).catch( error => ElMessage.error(error));
}

const loadTeacher = () => {
  teacher.all().then( res => {
    Teachers.value = res.data.data;
  }).catch( error => ElMessage.error(error));
}

const removePosition = (x: number, y: number) => {
  const id = { x: x, y: y };
  const class_course_teacher_id = ClassCourseTableMapReflect.value.get(JSON.stringify(id));
  ClassCourseTableMapReflect.value.delete(JSON.stringify(id));
  const newtimes = ClassCourseTableMap.value.get(class_course_teacher_id).filter( pos => (pos.x !== x || pos.y !== y));
  const RequestBody = [];
  if(newtimes.length < 1) {
    ClassCourseTableMap.value.delete(class_course_teacher_id);
  } else {
    ClassCourseTableMap.value.set(class_course_teacher_id, newtimes);
  }
  ClassCourseTableMap.value.forEach(( value, key ) => {
    const { course_id, teacher_id } = JSON.parse(key) as IClassTable;
    RequestBody.push({ course_id, teacher_id, json: JSON.stringify(value) });
  });
  classes.update(EditParams.value.class_id, { list: RequestBody }).then( () => {
   setTimeout(() => {
    ElMessage.warning("删除课程表成功");
   }, 500);
  }).catch(ElMessage.error)
}

onMounted(() => {
  EditParams.value.class_id = undefined;
  loadColleges();
  loadTeacher();
  loadCourses();
})
</script>
  
<style lang="scss" scoped>
.class-table-show-remove {
  .remove {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #f56c6c;
    color: #ffffff;
    text-align: center;
    line-height: 20px;
    top: 0px;
    right: -20px;
    transition: 100ms all ease;
  }
  &:hover {
    .remove{
      right: 0px;
    }
  }
}
.course-table-container {
  width: 60%;
  height: 700px;
  margin: 0 auto;
  .course-table-container-table {
    .course-table-container-item-tr {
      .course-table-container-item-td {
        width: calc(100% / 8);
        height: 80px;
        border: 1px solid $info;
        transition: 500ms all ease;
        + .course-table-container-item-td-hover {
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