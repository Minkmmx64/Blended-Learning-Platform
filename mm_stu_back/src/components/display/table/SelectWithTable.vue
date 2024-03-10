<template>
  <el-select
      placeholder="Select"
      size="large"
      style="width: 600px"
      v-model="watchSelectId"
  >
    <el-option
        v-for="(item, index) in DataSource"
        :key="item.id"
        :label="item.name"
        :value="item.id"
    >
      <el-row>
        <div>试卷名称: {{ item.name }} </div>
      </el-row>
    </el-option>
    <template #header>
      <slot name="header"></slot>
      <el-button
          class="ml-20"
          type="success"
          :loading="loading"
          @click="emit('query')"
      >
        查询
      </el-button>
      <el-button
          type="info"
          @click="emit('reset')"
      >
        <IconFont icon="refresh" />
      </el-button>
    </template>
    <template #footer>
      <el-row align="middle">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            @current-change="handleCurrentChange"
            small
            background
            layout="total, prev, pager, next"
            :total="total"
        />
        <el-button
            class="ml-20"
            type="primary"
            :loading="loading"
            @click="emit('refresh')"
        >
          刷新数据
        </el-button>
      </el-row>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

interface Emit {
  //表格刷新事件
  (event: "refresh") : void;
  //表格分页事件
  (event: "handleCurrentChange", offset: number) : void;
  // 查询
  (event: "query") : void;
  //表格重置事件
  (event: "reset") : void;

  (event: "update:selectValue", val: string) : void;
}

interface IProps {
  //数据源
  DataSource: any[];
  //加载
  loading: boolean;
  //数据总数
  total: number;
  // 选择的数据
  selectValue: number;
}

const Props = withDefaults(
    defineProps<IProps>(),
    {
      loading: false,
      total: 0,
    }
);

const emit = defineEmits<Emit>();

const watchSelectId = computed({
  get(){
    return Props.selectValue;
  },
  set(val){
    emit("update:selectValue", val as string);
  }
});


const currentPage = ref(1);
const pageSize = ref(10);

const handleCurrentChange = (val: number) => {
  emit("handleCurrentChange", val);
}

</script>

<style scoped lang="scss">

</style>