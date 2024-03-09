<template>
  <el-dialog
      fullscreen
      v-model="showDialog"
      title="编辑试卷"
      @close="Emits('update:showDialog', false)">
    <div class="show-real-subject-content flex-column flex-around">
        <div class="show-real-subject-content-idx pb-10 flex-row">
          <div @click="changeCurrentShowSubject(index)" class="idx select-none point" v-for="(item, index) in currentSelectSubjects" :key="index">
            {{ index + 1 }}
          </div>
        </div>
        <div v-if="currentSelectSubjects.length" class="show-real-subject-content-subject pb-10">
          <ShowSubjectProp :number="currentSelectSubjectNumber ?? 1" :data="currentSelectSubject ?? currentSelectSubjects[0]" />
        </div>
    </div>
    <div class="mt-10">
      <el-button @click="addSubjectTableContent" type="success"> 添加题目 </el-button>
      <el-button @click="saveSubjectTableContent" type="primary"> 保存题目 </el-button>
    </div>
    <TableContent
        class="w-full mt-10"
        :loading="TableLoading"
        :total="total"
        :DataSource="DataSource"
        @refresh="TableProps.loadTableDatas"
        @handleSizeChange="TableProps.handleSizeChange"
        @handleCurrentChange="TableProps.handleCurrentChange"
        @handleSortChange="TableProps.handleSortChange"
        @handleMultipleSelectAll="handleMultipleSelectAll"
        @handleMultipleSelect="handleMultipleSelect"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
          prop="id"
          label="ID"
          header-align="center"
          align="center"
      />
      <el-table-column
          prop="describe"
          label="题目描述"
          header-align="center"
          align="center"
      />
      <el-table-column
          prop="type"
          label="题目类型"
          header-align="center"
          align="center"
      />
      <el-table-column
          prop="options"
          label="题目选项"
          header-align="center"
          align="center"
      />
      <el-table-column
          prop="classify"
          label="题目分类"
          header-align="center"
          align="center"
      />
      <el-table-column
          prop="result"
          label="参考答案"
          header-align="center"
          align="center"
      />
    </TableContent>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="Emits('update:showDialog', false)"> 取消 </el-button>
          <el-button> 确定 </el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, ref, toRefs} from "vue";
import TableContent from "@/components/display/table/TableContent.vue";
import { subject, subjectdata, SubjectType, ISubjectProps } from "@/Request/ApiModules/subject";
import { useTableFunction } from "@/components/TableFunction/useTableFunction";
import ShowSubjectProp from "@/views/subject/component/ShowSubjectProp.vue";

interface IProps {
  showDialog: boolean;
  paperId: number;
}

const Props = withDefaults(
    defineProps<IProps>(),
    { showDialog: false, paperId: -1 }
);

const Emits = defineEmits(["update:showDialog"]);

const { showDialog } = toRefs(Props);

const EditParams = ref({

});

const QueryParams = ref({
  type: "",
  classify: "",
  describe: ""
});

const TableProps = useTableFunction<subject>(
    "题库",
    subject,
    QueryParams,
    EditParams,
    undefined,
    undefined,
    subjectdata
);

//当前选择的题目集合
const SubjectLists = ref<ISubjectProps[]>([]);
//已经选中的题目集合
const currentSelectSubjects = ref<ISubjectProps[]>([]);
// 当前选中的题目
const currentSelectSubject = ref<ISubjectProps>();

const { DataSource, TableLoading, total, isEdit, EditTxt, EditLoading } = TableProps;

const handleMultipleSelectAll = (selections: ISubjectProps[]) => {
  SubjectLists.value = selections;
}

const handleMultipleSelect = (selections: ISubjectProps[], row: ISubjectProps) => {
  SubjectLists.value = selections;
}

const changeCurrentShowSubject = (idx: number) => {
  currentSelectSubject.value = currentSelectSubjects.value[idx];

  currentSelectSubjectNumber.value = idx + 1;
}

const addSubjectTableContent = () => {
  currentSelectSubjects.value = [
      ...currentSelectSubjects.value,
      ...SubjectLists.value.filter(
          subject => !currentSelectSubjects.value.find(fa => fa.id === subject.id))
  ];
}

const saveSubjectTableContent = () => {
  console.log(currentSelectSubjects.value.map( subject => subject.id));
  console.log(Props.paperId);
}

const currentSelectSubjectNumber = ref();

onMounted(() => {
  TableProps.loadTableDatas();
})
</script>

<style lang="scss" scoped>
.show-real-subject-content-idx{
  gap: 20px;
  flex-wrap: wrap;
  flex: 1;
  color: #ffffff;
  border-bottom: 1px solid $info;
  .idx {
    @include center;
    width: 50px;
    height: 50px;
    background-color: #007aff;
    border-radius: 5px;
  }
}

.show-real-subject-content-subject{
  flex: 1;
  border-bottom: 1px solid $info;
}
</style>