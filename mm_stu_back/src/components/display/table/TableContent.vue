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
      v-loading="loading"
      @sort-change="handleSortChange"
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
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" />
        <div class="h-full flex-row flex-center mr-5">
          <el-button @click="emit('refresh')" type="primary" :loading="loading">刷新数据</el-button>
        </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
import { lazyFunc, ChildProps, Sorted } from "@/components/TableFunction/index.type";
interface IProps {
  //数据源
  DataSource: object[];
  //懒加载函数
  lazyLoad ?: lazyFunc<any>;
  //子列表名称 //懒加载bool字段名称
  child ?: ChildProps; 
  //表格key
  tableKey?: number;
  //加载
  loading: boolean;
  //数据总数
  total: number;
}

interface Emit {
  (event: "refresh") : void;
  (event: "handleSizeChange", limit: number) : void;
  (event: "handleCurrentChange", offset: number) : void;
  (event: "handleSortChange", sort: { prop: string, order: "descending" | "ascending" | null } ): void;
}

const emit = defineEmits<Emit>();

const Props = withDefaults(
  defineProps<IProps>(),
  { 
    tableKey: 0,
    loading: false,
    total: 0
  }
);

const handleSortChange = ({ column,  prop, order } : Sorted & { column : any } ) => {
  emit("handleSortChange", { prop, order });
  console.log(column);
}

const currentPage = ref(1);
const pageSize = ref(10);
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  emit("handleSizeChange", val);
}

const handleCurrentChange = (val: number) => {
  emit("handleCurrentChange", val);
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