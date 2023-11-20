<template>
  <div class="TableContent border-info relative">
    <el-table 
      style="width:100%; height: calc(100% - 50px)" 
      :data="Props.DataSource" 
      row-key="id" 
      lazy
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" 
      :load="load"
      stripe
      @sort-change="onSortChange"
      :efault-expand-all="DefaultExpandAll">
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
  DefaultExpandAll?: false;
}

const Props = withDefaults(
  defineProps<IProps>(),
  {
    DefaultExpandAll: false
  }
)

const onSortChange = (e: any) => {
  console.log(e);
}

const load = (
  row: any,
  treeNode: unknown,
  resolve: (date: any[]) => void
) => {
  setTimeout(() => {
    resolve([
      {
        id: 1,
        create_time: new Date(),
        update_time: new Date(),
        remark: "remark",
        status: 1,
        name: "name",
        key: "key",
        children: [
          {
            id: 2,
            create_time: new Date(),
            update_time: new Date(),
            remark: "remark",
            status: 1,
            name: "name",
            key: "key",
            children: [
              {
                id: 3,
                create_time: new Date(),
                update_time: new Date(),
                remark: "remark",
                status: 1,
                name: "name",
                key: "key",
              }
            ]
          }
        ]
      },
      {
        id: 4,
        create_time: new Date(),
        update_time: new Date(),
        remark: "remark",
        status: 1,
        name: "name",
        key: "key",
      }
    ])
  }, 1000)
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