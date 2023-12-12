<template>
  <div class="w-full h-full scroll">
    <div class="TableHead">
      <el-row
        class="mb-10 mt-10"
        :gutter="20"
      >
        <el-col :span="6">
          <div class="grid-content ep-bg-purple-dark">
            <el-button
              type="primary"
              @click="TableProps.handleEditOpen('create')"
            >
              添加{{ TableProps.apiname }}
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="QueryParams.course"
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
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="QueryParams.name"
            placeholder="menu name"
          />
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
            placeholder="chapter name"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>所属课程:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-select
            :disabled="isChooseCouese"
            v-model="EditParams.course"
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
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}封面:</span>
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
              :resource="EditParams.cover"
            />
          </el-upload>
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
            placeholder="chapter remark"
          />
        </el-col>
      </el-row>
      <el-row
        v-if="EditParams.pid"
        class="text-center"
      >
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>pid:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.pid"
            disabled
            placeholder="menu key"
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

    <TableContent
      :child="TableProps.childKey" 
      :lazy-load="TableProps.lazy" 
      :loading="TableLoading" 
      :total="total" 
      :table-key="TreeTableKey"
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
        width="100"
      />
      <el-table-column
        prop="name"
        label="章节名称"
        header-align="center"
        align="center"
        width="200"
      />
      <el-table-column
        prop="course.name"
        label="所属课程"
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
        prop="cover"
        label="封面"
        header-align="center"
        align="center"
        width="150"
      >
        <template #default="{ row }">
          <el-image
            style="width: 50px; height: 50px"
            :src="row.cover"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :initial-index="4"
            :preview-teleported="true"
            :preview-src-list="[row.cover]"
            fit="cover"
            :hide-on-click-modal="true"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="描述"
        header-align="center"
        align="center"
        width="250"
      />
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
          <!---->
          <el-button
            type="primary"
            @click="TableProps.handleEditOpen('create', row)"
          >
            添加子章节
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
import TableContent from "@/components/display/table/TableContent.vue";
import { chapter, ChapterEdit, ChapterQuery, chapterdata } from "@/Request/ApiModules/chapter";
import course from "@/Request/ApiModules/course";
import common from "@/Request/ApiModules/common";
import { useTreeTableFunction } from "@/components/TableFunction/useTreeTableFunction";
import { onMounted, ref } from "vue";
import { ElMessage, UploadRawFile } from "element-plus";

//添加修改对象
const EditParams = ref<ChapterEdit>({
  name: "",
  pid: undefined,
  remark: "",
  cover: "",
  course: undefined
});

const QueryParams = ref<ChapterQuery>({
  name: "",
  course: undefined
});

const isChooseCouese = ref(false);
const TableProps = useTreeTableFunction<chapter, ChapterQuery, ChapterEdit>(
  "章节",
  chapter,
  QueryParams,
  { childrenKey: "child", hasChildrenKey: "hashChild" },
  EditParams,
  undefined,
  {
    beforehandleEditOpen(row) {
      if(row !== undefined) {
        isChooseCouese.value = true;
      }else isChooseCouese.value = false;
    },
  },
  chapterdata
);
const { isEdit, DataSource, TableLoading, total, TreeTableKey , EditTxt, EditLoading } = TableProps;

const Courses = ref([]);

const loadCourse = () => {
  course.all().then( res => {
    Courses.value = res.data.data;
  }).catch( error => ElMessage.error(error));
}

const onBeforeUpload = (rawFile: UploadRawFile) => {
  const data = new FormData();
  data.append("file", rawFile);
  common.upload(data).then(res => {
    setTimeout(() => {
      const url = res.data.data.url;
      EditParams.value.cover = url;
      ElMessage.success("上传成功!");
    }, 500);
  }).catch(error => { ElMessage.error("上传失败!" + error); })
  return false;
}

onMounted(() => {
  TableProps.loadTableDatas();
  loadCourse();
})
</script>