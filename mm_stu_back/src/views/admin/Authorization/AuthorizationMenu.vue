<template>
  <TableContent 
    :child="childKey"
    :lazyLoad="lazy"
    :DataSource="DataSource">
    <!-- <el-table-column prop="id" label="id" /> -->
    <el-table-column fixed prop="name" label="路由名称" header-align="center" align="center"/>
    <el-table-column prop="key" label="路由关键字" header-align="center" align="center"/>
    <el-table-column prop="status" label="状态" sortable="custom" header-align="center" align="center">
      <template #default="scope">
        <el-tag v-if="scope.row.status" class="ml-2 select-none" type="success">启用</el-tag>
        <el-tag v-else class="ml-2 select-none" type="danger">禁用</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="remark" label="描述" header-align="center" align="center"/>
    <el-table-column prop="create_time" label="创建时间" header-align="center" align="center"/>
    <el-table-column prop="update_time" label="修改时间" header-align="center" align="center"/>
    <el-table-column flex="right" label="操作" header-align="center" align="center" >
      <template #default> <!--#default="{ row }"-->
        <el-button type="success">编辑</el-button>
        <el-divider direction="vertical" />
        <el-button type="danger">删除</el-button>
      </template>
    </el-table-column>
  </TableContent>

</template>
<script lang="ts" setup>
import TableContent from "@/components/display/table/TableContent.vue";
import { menu , MenuQueryDTO } from "@/Request/ApiModules/menu";
import { useTreeTableFunction } from "@/components/TableFunction/useTreeTableFunction";
import { onMounted } from "vue";

const { DataSource , loadTableDatas, childKey, lazy } = useTreeTableFunction<menu, MenuQueryDTO>(
  menu,
  {}, 
  { childrenKey : "child", hasChildrenKey: "hashChild"}
);

onMounted(() => {
  loadTableDatas();
})
</script>
