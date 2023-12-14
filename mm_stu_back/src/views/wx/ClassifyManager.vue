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
            placeholder="classify name"
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
            placeholder="classify name"
          />
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
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}描述:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.remark"
            placeholder="classify remark"
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
        prop="name"
        label="分类名称"
        header-align="center"
        align="center"
        width="200"
      />
      <el-table-column
        prop="avatar"
        label="分类图片"
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
import { classify } from "@/Request/ApiModules/wx/classify";
import { useTableFunction } from "@/components/TableFunction/useTableFunction";
import { onMounted, ref } from "vue";
import { ElMessage, UploadRawFile } from "element-plus";
import common from "@/Request/ApiModules/common";
//添加修改对象
const EditParams = ref({
  name: "",
  remark: "",
  avatar: "",
});

//查询对象
const QueryParams = ref({
  name: ""
});

const TableProps = useTableFunction<classify>(
  "分类",
  classify,
  QueryParams,
  EditParams,
  undefined,
);

const { isEdit, DataSource, TableLoading, total , EditTxt, EditLoading } = TableProps;

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
})
</script>
