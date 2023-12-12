<template>
  <div class="w-full h-full scroll">
    <div class="TableHead">
      <el-row class="mb-10 mt-10" :gutter="20">
        <el-col :span="6">
          <div class="grid-content ep-bg-purple-dark">
            <el-button
              type="primary"
              @click="TableProps.handleEditOpen('create')"
            >
              添加 {{ TableProps.apiname }}
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="QueryParams.name"
            placeholder="teacher name"
          />
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="QueryParams.authentication"
            class="m-2"
            placeholder="select authentication"
          >
            <el-option
              v-for="item in Authentication"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <div class="grid-content ep-bg-purple-dark">
            <el-button
              type="success"
              @click="TableProps.loadTableDatas()"
            >
              查询 {{ TableProps.apiname }}
            </el-button>
            <el-button
              type="info"
              @click="TableProps.handleClearQuery()"
            >
              <IconFont icon="refresh" />
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      v-model="isEdit"
      :title="`${EditTxt}-${TableProps.apiname}`"
      width="30%"
    >
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}名称:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.name"
            placeholder="teacher name"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}性别:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-select
            v-model="EditParams.gender"
            class="m-2"
            placeholder="select gender"
          >
            <el-option
              v-for="item in ['男','女']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}年龄:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input-number
            v-model="EditParams.age"
            controls-position="right"
            class="m-2"
            placeholder="teacher age"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}简介:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.profile"
            :rows="2"
            type="textarea"
            resize="none"
            placeholder="teacher profile"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}描述:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.remark"
            placeholder="teacher remark"
          />
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="TableProps.handleEditClose">取消</el-button>
          <el-button
            type="primary"
            :loading="EditLoading"
            @click="TableProps.handleEditConfirm"
          > {{ EditTxt }} </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加教师关联 -->
    <el-dialog
      class="scroll"
      v-model="isAddRealCourse"
      title="关联课程"
      width="30%"
      style="height: 500px;"
    >
      <template v-for="(item, index) in AddRealCourseIds">
        <el-row class="mt-5 flex-row flex-alg">
          <el-select
            v-model="AddRealCourseIds[index]"
            class="m-2"
            placeholder="select course"
          >
            <el-option
              v-for="item in Courses"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.disabled"
            />
          </el-select>
          <div class="badge-hover select-none point" @click="removeRealCourse(index)">x</div>
        </el-row>
      </template>
      <div @click="addRealCourse" class="teacher-manager-course-add shadow-info border-info select-none text-success point">
        添加课程
      </div>
      <template #footer>
        <span class="dialog-footer footer">
          <el-button @click="isAddRealCourse = false">取消</el-button>
          <el-button
            type="primary"
            :loading="EditLoading"
            @click="commitRealCourse"
          > 提交 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加教师关联 -->

    <TableContent
      :loading="TableLoading" 
      :total="total" 
      :DataSource="DataSource"
      @refresh="TableProps.loadTableDatas"
      @handleSizeChange="TableProps.handleSizeChange"
      @handleCurrentChange="TableProps.handleCurrentChange"
      @handleSortChange="TableProps.handleSortChange"
    >
      <el-table-column
        fixed
        type="index"
        width="50"
      />
      <el-table-column
        prop="id"
        label="ID"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        prop="code"
        label="职工号"
        header-align="center"
        align="center"
        width="200"
      />
      <el-table-column
        prop="name"
        label="教师姓名"
        header-align="center"
        align="center"
        width="200"
      />
      <el-table-column
        prop="gender"
        label="性别"
        header-align="center"
        align="center"
        width="80"
      />
      <el-table-column
        prop="profile"
        label="教师简介"
        header-align="center"
        align="center"
        width="200"
      />
      <el-table-column
        prop="authentication"
        label="教师认证状态"
        header-align="center"
        align="center"
        width="120"
      >
        <template #default="{ row }">
          <el-tag
            class="ml-2 select-none"
            :type="row.authentication === '待认证' ? 'warning' : 'success'"
          >
            {{ row.authentication }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="描述"
        header-align="center"
        align="center"
        width="200"
      />
      <el-table-column
        prop="status"
        label="状态"
        sortable
        header-align="center"
        align="center"
        width="150"
      >
        <template #default="{ row }">
          <el-tag
            v-if="row.status"
            class="ml-2 select-none"
            type="success"
          >
            启用
          </el-tag>
          <el-tag
            v-else
            class="ml-2 select-none"
            type="danger"
          >
            禁用
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        header-align="center"
        align="center"
        width="150"
      >
        <template #default="{ row }">
          <showTime :date="row.create_time" />
        </template>
      </el-table-column>
      <el-table-column
        prop="update_time"
        label="修改时间"
        header-align="center"
        align="center"
        width="150"
      >
        <template #default="{ row }">
          <showTime :date="row.update_time" />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        header-align="center"
        align="center"
        width="300"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            @click="OpenAddRealCourse(row)"
          >
            添加关联课程
          </el-button>
          <el-divider direction="vertical" />
          <el-button
            type="success"
            @click="TableProps.handleEditOpen('update', row)"
          >
            编辑
          </el-button>
          <el-divider direction="vertical" />
          <el-button
            type="danger"
            @click="TableProps.handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </TableContent>
  </div>
</template>
<script lang="ts" setup>
import Teacher,{ teacher, TeacherEdit, TeacherQuery, Authentication } from "@/Request/ApiModules/teacher";
import course from "@/Request/ApiModules/course";
import { useTableFunction } from "@/components/TableFunction/useTableFunction";
import { onMounted, ref, watch } from "vue";
import { Gender } from "@/Request/index.type";
import { KeyValue } from "@/components/TableFunction/index.type";
import { ElMessage } from "element-plus";

//添加修改对象
const EditParams = ref<TeacherEdit>({
  name: "",
  remark: "",
  age: undefined,
  profile: "",
  gender: Gender.nan
});
//查询对象
const QueryParams = ref<TeacherQuery>({
  name: "",
  authentication: undefined
});

const TableProps = useTableFunction<teacher, TeacherQuery, TeacherEdit>(
  "教师",
  teacher,
  QueryParams,
  EditParams,
  undefined
);

const { isEdit, DataSource, TableLoading, total , EditTxt, EditLoading } = TableProps;

const isAddRealCourse = ref(false);
const AddRealCourseIds = ref([]);
const Courses = ref([]);
const TeacherId = ref(0);

const loadCourse = async () => {
  const req = await course.all();
  Courses.value = req.data.data;
}

const OpenAddRealCourse = (row : KeyValue) => {
  isAddRealCourse.value = true;
  AddRealCourseIds.value = row.courses.map( course => course.id);
  TeacherId.value = row.id;
}

const addRealCourse = () => {
  AddRealCourseIds.value.push(undefined);
}

const commitRealCourse = () => {
  EditLoading.value = true;
  Teacher.real(AddRealCourseIds.value, TeacherId.value).then( res => {
    setTimeout(() => {
      EditLoading.value = false;
      isAddRealCourse.value = false;
      ElMessage.success("关联课程成功");
      TableProps.loadTableDatas();
    }, 500);
  }).catch( error => {
    ElMessage.error(error);
    EditLoading.value = false;
  })
}

const removeRealCourse = (id: number) => {
  AddRealCourseIds.value.splice(id, 1)
}

watch(
  () => [AddRealCourseIds.value],
  () => {
    if(Courses.value && Courses.value.length) {
      for(let i = 0 ; i < Courses.value.length; i ++) {
        if(AddRealCourseIds.value.includes(Courses.value[i].id))
          Courses.value[i].disabled = true;
        else Courses.value[i].disabled = false;
      }
    }
  },
  { deep: true }
)

onMounted( async () => {
  TableProps.loadTableDatas();
  loadCourse();
})
</script>

<style lang="scss" scoped>
.teacher-manager-course-add {
  width: 100px;
  height: 30px;
  border-style: dashed;
  border-width: 1px;
  border-color: $info;
  margin: 10px auto;
  line-height: 30px;
  text-align: center;
  background-color: #fff;
}
.badge-hover{
  width: 20px;
  margin-left: 20px;
  height: 20px;
  border-radius: 50%;
  background-color:  $info;
  color: #fff;
  text-align: center;
  line-height: 20px;
}

</style>
