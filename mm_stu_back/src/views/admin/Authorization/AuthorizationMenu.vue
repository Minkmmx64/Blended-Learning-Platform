<template>
  <div class="w-full h-full">
    <el-dialog v-model="isEdit" :title="`${EditTxt}-${TableProps.apiname}`" width="30%">
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="TableProps.handleEditClose">取消</el-button>
          <el-button type="primary" @click="TableProps.handleEditConfirm"> {{ EditTxt }} </el-button>
        </span>
      </template>
    </el-dialog>
    <TableContent
      :child="TableProps.childKey" 
      :lazyLoad="TableProps.lazy" 
      :loading="loading" 
      :total="total" 
      @refresh="TableProps.loadTableDatas"
      @handleSizeChange="TableProps.handleSizeChange"
      @handleCurrentChange="TableProps.handleCurrentChange"
      @handleSortChange="TableProps.handleSortChange"
      :table-key="TreeTableKey" 
      :DataSource="DataSource">
      <el-table-column fixed type="index" width="50" />
      <el-table-column prop="name" label="路由名称" header-align="center" align="center" width="200" />
      <el-table-column prop="key" label="路由关键字" header-align="center" align="center" />
      <el-table-column prop="status" label="状态" sortable header-align="center" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status" class="ml-2 select-none" type="success">启用</el-tag>
          <el-tag v-else class="ml-2 select-none" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="描述" header-align="center" align="center" />
      <el-table-column prop="create_time" label="创建时间" header-align="center" align="center" width="300" />
      <el-table-column prop="update_time" label="修改时间" header-align="center" align="center" width="300" />
      <el-table-column flex="right" label="操作" header-align="center" align="center" width="300">
        <template #default="{ row }"> <!---->
          <el-button type="primary" @click="TableProps.handleEditOpen('create', row)">添加子菜单</el-button>
          <el-divider direction="vertical" />
          <el-button type="success" @click="TableProps.handleEditOpen('update', row)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button type="danger" @click="TableProps.handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </TableContent>
  </div>
</template>
<script lang="ts" setup>
import TableContent from "@/components/display/table/TableContent.vue";
import { menu, MenuQueryDTO } from "@/Request/ApiModules/menu";
import { useTreeTableFunction } from "@/components/TableFunction/useTreeTableFunction";
import { onMounted, ref } from "vue";

const EditParams = ref();

const TableProps = useTreeTableFunction<menu, MenuQueryDTO>(
  "菜单",
  menu,
  {},
  { childrenKey: "child", hasChildrenKey: "hashChild" },
  EditParams
);
const { isEdit, DataSource, loading, total, TreeTableKey , EditTxt} = TableProps;

onMounted(() => {
  TableProps.loadTableDatas();
})
</script>
