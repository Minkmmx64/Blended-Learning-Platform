<template>
  <div class="w-full h-full scroll">
    <div class="TableHead">
      <el-row
        class="mb-10 mt-10"
        :gutter="20"
      >
        <el-col :span="6">
          <div class="grid-content ep-bg-purple-dark">
            <el-button
              type="primary"
              @click="TableProps.handleEditOpen('create')"
            >
              添加 {{ TableProps.apiname }}
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row 
        class="mb-10 mt-10"
        :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="QueryParams.describe"
            placeholder="subject describe"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="QueryParams.classify"
            placeholder="subject classify"
          />
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="QueryParams.type"
            class="m-2"
            placeholder="select type"
            >
            <el-option
              v-for="item in SubjectType"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
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

    <el-dialog
      v-model="isEdit"
      :title="`${EditTxt}-${TableProps.apiname}`"
      width="30%"
    >
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>题目描述:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            resize="none"
            type="textarea"
            :rows="4"
            v-model="EditParams.describe"
            placeholder="subject describe"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>题目类型:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-select
            v-model="EditParams.type"
            class="m-2"
            placeholder="select type"
          >
            <el-option
              v-for="item in SubjectType"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>题目分类:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.classify"
            placeholder="subject classify"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>参考答案:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.result"
            placeholder="subject result"
          />
        </el-col>
      </el-row>
      <el-row v-if="EditParams.type === SubjectType.Signal || SubjectType.Multiple === EditParams.type" class="mb-5 text-center flex-column">
        <div class="mb-10">题目选项:</div>
        <div class="w-full flex-column flex-center mt-5" v-for="(item, index) in EditParams.options">
          <el-row class="w-full flex-row flex-around">
            {{ String.fromCharCode("A".charCodeAt(0) + index) }}:
            <el-input
              style="width: 50%"
              v-model="EditParams.options[index]"
              placeholder="subject options"
            />
            <el-button @click="delSubjectOption(index)" type="danger">删除</el-button>
          </el-row>
        </div>
        <el-button 
          class="mt-5" 
          @click="addSubjectOption" 
          type="success" 
          style="align-self: center;">添加</el-button>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>题目备注:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.remark"
            placeholder="subject remark"
          />
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="TableProps.handleEditClose">取消</el-button>
          <el-button
            type="primary"
            :loading="EditLoading"
            @click="TableProps.handleEditConfirm"
          > {{ EditTxt }} </el-button>
        </span>
      </template>
    </el-dialog>

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
        prop="describe"
        label="题目描述"
        header-align="center"
        align="center"
        width="300"
      />
      <el-table-column
        prop="type"
        label="题目类型"
        header-align="center"
        align="center"
        width="150"
      />
      <el-table-column
        prop="options"
        label="题目选项"
        header-align="center"
        align="center"
        width="300"
      />
      <el-table-column
        prop="classify"
        label="题目分类"
        header-align="center"
        align="center"
        width="150"
      />
      <el-table-column
        prop="result"
        label="参考答案"
        header-align="center"
        align="center"
        width="150"
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
            type="success"
            @click="TableProps.handleEditOpen('update', row)"
          >
            编辑
          </el-button>
          <el-divider direction="vertical" />
          <el-button
            type="danger"
            @click="TableProps.handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </TableContent>
  </div>
</template>
<script lang="ts" setup>
import TableContent from "@/components/display/table/TableContent.vue";
import { subject, subjectdata, SubjectType } from "@/Request/ApiModules/subject";
import { useTableFunction } from "@/components/TableFunction/useTableFunction";
import { onMounted, ref } from "vue";

const EditParams = ref({
  remark: "",
  describe: "",
  type: "",
  result: "",
  classify: "",
  options: [

  ]
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

const { DataSource, TableLoading, total, isEdit, EditTxt, EditLoading } = TableProps;

const delSubjectOption = (del: number) => {
  EditParams.value.options.splice(del, 1);
}

const addSubjectOption = () => {
  EditParams.value.options.push("");
}

onMounted(() => {
  TableProps.loadTableDatas();
})
</script>