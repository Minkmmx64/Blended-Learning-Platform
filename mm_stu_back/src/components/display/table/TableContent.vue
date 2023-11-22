<template>
  <div class="TableContent border-info relative">
    <el-table 
      style="width:100%; height: calc(100% - 50px)" 
      :data="Props.DataSource" 
      row-key="id" 
      lazy
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" 
      :load="Props.lazyLoad"
      stripe
      @sort-change="onSortChange"
      :efault-expand-all="false">
      <slot></slot>
    </el-table>
    <div class="Pagination absolute flex-row flex-jus">
      <el-pagination 
        v-model:current-page="currentPage"
        v-model:page-size="pageSize" 
        :page-sizes="[100, 200, 300, 400]"
        :small="small" 
        :disabled="disabled" 
        :background="background" 
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from "vue";

interface IProps {
  DataSource: any[];
  lazyLoad ?: <T> (
    row: T,
    treeNode: unknown,
    resolve: (date: T[]) => void
  ) => void;
}

const Props = withDefaults(
  defineProps<IProps>(),
  {
    
  }
)

const onSortChange = (e: any) => {
  console.log(e);
}



const currentPage = ref(4)
const pageSize = ref(100)
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
  height: 700px;
}

.Pagination {
  bottom: 0px;
  right: 0px;
  height: 50px;
}
</style>