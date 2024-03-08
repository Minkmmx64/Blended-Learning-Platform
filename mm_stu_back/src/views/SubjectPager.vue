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
              添加 {{ TableProps.apiname }}
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="QueryParams.name"
            placeholder="paper name"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="QueryParams.classify"
            placeholder="paper classify"
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
            <span>试卷名称:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.name"
            placeholder="subject result"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>试卷分类:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.classify"
            placeholder="subject remark"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>试卷备注:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.remark"
            placeholder="subject remark"
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
        width="100"
      />
      <el-table-column
        prop="name"
        label="试卷名称"
        header-align="center"
        align="center"
        width="300"
      />
      <el-table-column
        prop="total"
        label="试卷总分"
        header-align="center"
        align="center"
        width="150"
      />
      <el-table-column
        prop="classify"
        label="试卷分类"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="create_time"
        label="创建时间"
        header-align="center"
        align="center"
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
            type="info"
          >
            添加关联题目
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
import { paper } from "@/Request/ApiModules/paper";
import { useTableFunction } from "@/components/TableFunction/useTableFunction";
import { onMounted, ref } from "vue";
import { useUserStore } from '@/store/index';

const teacher_user = useUserStore();

const EditParams = ref({
  remark: "",
  name: "",
  classify: "",
  teacher_id: undefined
});

const QueryParams = ref({
  name: "",
  classify: "",
});

const TableProps = useTableFunction<paper>(
  "试卷",
  paper,
  QueryParams,
  EditParams,
  undefined,
  {
    beforehandleEditConfirm() {
      EditParams.value.teacher_id = teacher_user.getUser.teacher?.id;
    },
  },
);

const { DataSource, TableLoading, total, isEdit, EditTxt, EditLoading } = TableProps;

onMounted(() => {

  TableProps.loadTableDatas();
})
</script>