<template>
  <TableContent :DataSource="TableData">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="create_time" label="create_time" />
    <el-table-column prop="update_time" label="update_time" />
    <el-table-column prop="status" label="status" sortable="custom"/>
    <el-table-column prop="name" label="name" />
    <el-table-column prop="key" label="key" />
  </TableContent>

</template>
<script lang="ts" setup>
import TableContent from "@/components/display/table/TableContent.vue";

import { useTableFunction } from "@/components/TableFunction/useTableFunction";


const { TableData } = useTableFunction();
</script>
