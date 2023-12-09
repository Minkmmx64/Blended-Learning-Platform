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
            placeholder="stu name"
          />
        </el-col>
        <el-col :span="6">
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
      width="50%"
    >
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}姓名:</span>
          </div>
        </el-col>
        <el-col :span="12">
          <el-input
            v-model="EditParams.name"
            placeholder="stu name"
          />
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
            placeholder="select year"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}班级:</span>
          </div>
        </el-col>
        <el-col :span="18">
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
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}入学年份:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-select
            v-model="EditParams.year"
            class="m-2"
            placeholder="select year"
          >
            <el-option
              v-for="item in getYears()"
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
            <span>{{ TableProps.apiname }}籍贯:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-cascader
            placeholder="select native"
            v-model="EditParams.native"
            :options="TProvinceToElCascader()"
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
            <span>{{ TableProps.apiname }}照片:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-upload
            ref="uploadRef"
            class="upload-demo mt-5"
            :before-upload="onBeforeUpload"
          >
            <ImageLayout
              class="mt-5"
              :width="80"
              :height="80"
              :resource="EditParams.avatar"
            />
          </el-upload>
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
        width="70"
        header-align="center"
        align="center"
        label="序号"
      />
      <el-table-column
        prop="id"
        label="ID"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        prop="name"
        label="学生姓名"
        header-align="center"
        align="center"
        width="150"
      />
      <el-table-column
        prop="student"
        label="学号"
        header-align="center"
        align="center"
        width="150"
      />
      <el-table-column
        prop="class.name"
        label="班级"
        header-align="center"
        align="center"
        width="250"
      />
      <el-table-column
        prop="gender"
        label="性别"
        header-align="center"
        align="center"
        width="150"
      />
      <el-table-column
        prop="native"
        label="籍贯"
        header-align="center"
        align="center"
        width="150"
      />
      <el-table-column
        prop="school"
        label="学校"
        header-align="center"
        align="center"
        width="300"
      />
      <el-table-column
        prop="age"
        label="年龄"
        header-align="center"
        align="center"
        width="150"
      />
      <el-table-column
        prop="avatar"
        label="学籍照片"
        header-align="center"
        align="center"
        width="150"
      >
        <template #default="{ row }">
          <el-image
            style="width: 50px; height: 50px"
            :src="row.avatar"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :initial-index="4"
            :preview-teleported="true"
            :preview-src-list="[row.avatar]"
            fit="cover"
            :hide-on-click-modal="true"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="year"
        label="入学年份"
        header-align="center"
        align="center"
        width="150"
      />
      <el-table-column
        prop="remark"
        label="描述"
        header-align="center"
        align="center"
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
import { stu, StuEdit, StuQuery, studata } from "@/Request/ApiModules/stu";
import classes from "@/Request/ApiModules/class";
import { useTableFunction } from "@/components/TableFunction/useTableFunction";
import { onMounted, ref } from "vue";
import { getYears, TProvinceToElCascader } from "@/utils/common";
import { ElMessage, UploadRawFile } from "element-plus";
import common from "@/Request/ApiModules/common";
import { Gender } from "@/Request/index.type";
//添加修改对象
const EditParams = ref<StuEdit>({
  name: "",
  class_id: undefined,
  gender: Gender.nan,
  year: undefined,
  age: undefined,
  native: [],
  avatar: ""
});
//查询对象
const QueryParams = ref<StuQuery>({
  name: "",
  class_id: undefined
});
// 班级列表
const Classes = ref([]);

const TableProps = useTableFunction<stu, StuQuery, StuEdit>(
  "学生",
  stu,
  QueryParams,
  EditParams,
  undefined,
  {
    beforehandleEditOpen(){
      loadColleges();
    },
  },
  studata
);

const { isEdit, DataSource, TableLoading, total , EditTxt, EditLoading } = TableProps;

const loadColleges = () => {
  classes.all().then( res => {
    Classes.value = res.data.data;
  }).catch( error => ElMessage.error(error));
}

const onBeforeUpload = (rawFile: UploadRawFile) => {
  const data = new FormData();
  data.append("file", rawFile);
  common.upload(data).then(res => {
    setTimeout(() => {
      const url = res.data.data.url;
      EditParams.value.avatar = url;
      ElMessage.success("上传成功!");
    }, 500);
  }).catch(error => { ElMessage.error("上传失败!" + error); })
  return false;
}

onMounted( async () => {
  TableProps.loadTableDatas();
  loadColleges();
})
</script>
