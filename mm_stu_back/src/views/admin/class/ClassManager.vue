<template>
  <div class="w-full h-full scroll">
    <div class="TableHead">
      <el-row class="mb-10 mt-10">
        <el-col :span="24">
          <div class="grid-content ep-bg-purple-dark" >
            <el-button type="primary" @click="TableProps.handleEditOpen('create')">添加 {{ TableProps.apiname }}</el-button>
          </div>
        </el-col>
    </el-row>
    </div>
    <el-dialog v-model="isEdit" :title="`${EditTxt}-${TableProps.apiname}`" width="30%">
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}名称:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input v-model="EditParams.name" placeholder="class name" />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>所属学院:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-select v-model="EditParams.college_id" class="m-2" placeholder="select college">
           <el-option
             v-for="item in Colleges"
             :key="item.id"
             :label="item.name"
             :value="item.id"
           />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}描述:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input v-model="EditParams.remark" placeholder="class remark" />
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="TableProps.handleEditClose">取消</el-button>
          <el-button type="primary" @click="TableProps.handleEditConfirm" :loading="EditLoading"> {{ EditTxt }} </el-button>
        </span>
      </template>
    </el-dialog>

    <TableContent
      :loading="TableLoading" 
      :total="total" 
      @refresh="TableProps.loadTableDatas"
      @handleSizeChange="TableProps.handleSizeChange"
      @handleCurrentChange="TableProps.handleCurrentChange"
      @handleSortChange="TableProps.handleSortChange"
      :DataSource="DataSource">
      <el-table-column fixed type="index" width="50" />
      <el-table-column prop="id" label="ID" header-align="center" align="center" width="50"/>
      <el-table-column prop="name" label="班级" header-align="center" align="center" width="200" />
      <el-table-column prop="remark" label="描述" header-align="center" align="center" />
      <el-table-column prop="status" label="状态" sortable header-align="center" align="center" width="150">
        <template #default="{ row }">
          <el-tag v-if="row.status" class="ml-2 select-none" type="success">启用</el-tag>
          <el-tag v-else class="ml-2 select-none" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" header-align="center" align="center" width="150" >
        <template #default="{ row }">
          <showTime :date="row.create_time"/>
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="修改时间" header-align="center" align="center" width="150" >
        <template #default="{ row }">
          <showTime :date="row.update_time"/>
        </template>
      </el-table-column>
      <el-table-column flex="right" label="操作" header-align="center" align="center" width="300">
        <template #default="{ row }">
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
import { classes, ClassEdit, ClassQuery } from "@/Request/ApiModules/class";
import college from "@/Request/ApiModules/college";
import { useTableFunction } from "@/components/TableFunction/useTableFunction";
import { onMounted, ref } from "vue";
import { KeyValue } from "@/components/TableFunction/index.type";
import { ElMessage } from "element-plus";
//添加修改对象
const EditParams = ref<ClassEdit>({
  name: "",
  remark: "",
  college_id : 0
});
//查询对象
const QueryParams = ref<ClassQuery>({
  name: "",
  college_id: 0
});
//学院列表
const Colleges = ref<KeyValue[]>([]);

const TableProps = useTableFunction<classes, ClassQuery, ClassEdit>(
  "班级",
  classes,
  QueryParams,
  EditParams,
  undefined,
  {
    beforehandleEditOpen(){
      college.all().then( res => {
        Colleges.value = res.data.data;
      }).catch( error => ElMessage.error(error));
    }
  }
);

const { isEdit, DataSource, TableLoading, total , EditTxt, EditLoading } = TableProps;

onMounted( async () => {
  TableProps.loadTableDatas();
})
</script>
