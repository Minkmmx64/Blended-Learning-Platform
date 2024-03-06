<template>
  <div class="w-full h-full scroll">
    <div class="TableHead">
      <el-row
        class="mb-10 mt-10"
        :gutter="20"
      >
        <el-col :span="6">
          
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
        label="签到名称"
        header-align="center"
        align="center"
        width="300"
      />
      <el-table-column
        prop="type"
        label="签到类型"
        header-align="center"
        align="center"
        width="150"
      />
      <el-table-column
        prop="class.name"
        label="签到班级"
        header-align="center"
        align="center"
        width="300"
      />
      <el-table-column
        prop="course.name"
        label="签到课程"
        header-align="center"
        align="center"
        width="150"
      />
      <el-table-column
        prop="teacher.name"
        label="发起人"
        header-align="center"
        align="center"
        width="150"
      />
      <el-table-column
        prop="start"
        label="签到开始"
        sortable
        header-align="center"
        align="center"
        width="300"
      />
      <el-table-column
        prop="end"
        label="签到结束"
        sortable
        header-align="center"
        align="center"
        width="300"
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
            type="danger"
          >
            无操作
          </el-button>
        </template>
      </el-table-column>
    </TableContent>
  </div>
</template>
<script lang="ts" setup>
import TableContent from "@/components/display/table/TableContent.vue";
import Sign, { SignQuery, sign } from "@/Request/ApiModules/sign";
import { useTableFunction } from "@/components/TableFunction/useTableFunction";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/store";

const user = useUserStore();

const EditParams = ref({
  
});

const QueryParams = ref<SignQuery>({
  teacher_id: undefined,
  class_id: undefined,
  course_id: undefined,
  sign_type: undefined
});

const TableProps = useTableFunction<sign, SignQuery>(
  "菜单",
  sign,
  QueryParams,
  EditParams,
  undefined,
  undefined,
);

const { DataSource, TableLoading, total } = TableProps;

onMounted(() => {
  if(user.getUser.teacher) {
    QueryParams.value.teacher_id = user.getUser.teacher.id;
  }

  TableProps.loadTableDatas();
})
</script>