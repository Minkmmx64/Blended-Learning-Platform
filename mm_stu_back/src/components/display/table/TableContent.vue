<template>
  <div class="TableContent border-info relative">
    <el-table 
      style="width:100%; height: calc(100% - 50px)" 
      :data="Props.DataSource" 
      row-key="id" 
      lazy
      :tree-props="{ children: Props.child?.childrenKey, hasChildren: Props.child?.hasChildrenKey }" 
      :load="Props.lazyLoad"
      stripe
      @sort-change="onSortChange"
      :key="Props.tableKey"
      :efault-expand-all="false">
      <slot></slot>
    </el-table>
    <div class="Pagination absolute flex-row flex-jus">
      <el-pagination 
        v-model:current-page="currentPage"
        v-model:page-size="pageSize" 
        :page-sizes="[10, 20, 30, 40]"
        :small="small" 
        :disabled="disabled" 
        :background="background" 
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" />
        <div class="h-full flex-row flex-center mr-5">
          <el-button @click="emit('refresh')" type="primary">刷新数据</el-button>
        </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
import { lazyFunc, ChildProps } from "@/components/TableFunction/index.type";
import { DataModules } from "@/Request/DataModules/DataModules";
interface IProps {
  //数据源
  DataSource: object[];
  //懒加载函数
  lazyLoad ?: lazyFunc<any>;
  //子列表名称 //懒加载bool字段名称
  child ?: ChildProps; 
  //表格key
  tableKey?: number;
}

interface Emit {
  (event: "refresh") : void;
}

const emit = defineEmits<Emit>();

const Props = withDefaults(
  defineProps<IProps>(),
  { tableKey: 0 }
);

const onSortChange = (e: any) => {
  console.log(e);
}

const onExpandChange = (row: any, o: any) => {
  console.log(row, o);
}

const currentPage = ref(4)
const pageSize = ref(10)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}

const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

</script>
<style lang="scss" scoped>
.TableContent {
  width: 90%;
  margin: 0 auto;
  height: calc(100% - 50px);
}

.Pagination {
  bottom: 0px;
  right: 0px;
  height: 50px;
}
</style>