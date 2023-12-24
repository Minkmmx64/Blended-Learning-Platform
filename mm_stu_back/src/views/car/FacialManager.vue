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
              v-model="QueryParams.servename"
              placeholder="serve servename"
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
              v-model="EditParams.servename"
              placeholder="serve servename"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}接待人:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
              v-model="EditParams.waiter"
              placeholder="serve waiter"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}收费标准:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input-number
              v-model="EditParams.fee"
              placeholder="serve fee"
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
          prop="servename"
          label="服务名称"
          header-align="center"
          align="center"
      />
      <el-table-column
          prop="waiter"
          label="接待人"
          header-align="center"
          align="center"
      />
      <el-table-column
          prop="fee"
          label="收费标准"
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
          fixed="right"
          label="操作"
          header-align="center"
          align="center"
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
import { serve } from "@/Request/ApiModules/mongodb/serve";
import { useTableFunction } from "@/components/TableFunction/useTableFunction";
import { onMounted, ref } from "vue";

//添加修改对象
const EditParams = ref({
  servename: "",
  waiter: "",
  fee: undefined
});
//查询对象
const QueryParams = ref({
  servename: ""
});

const TableProps = useTableFunction(
    "服务",
    serve,
    QueryParams,
    EditParams,
    undefined,
);

const { isEdit, DataSource, TableLoading, total , EditTxt, EditLoading } = TableProps;

onMounted( async () => {
  TableProps.loadTableDatas();
})

</script>
