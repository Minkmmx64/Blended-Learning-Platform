<template>
  <div class="w-full h-full scroll">
    <div class="TableHead">
      <el-row class="mb-10 mt-10" :gutter="20">
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
        <el-col :span="6">
          <el-input
              v-model="QueryParams.username"
              placeholder="user username"
          />
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
            <span>{{ TableProps.apiname }}名称:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
              v-model="EditParams.username"
              placeholder="user username"
          />
        </el-col>
        <el-row v-show="TableProps.EditTxt.value !== '添加' " class="mt-10" v-for="(item, index) in EditParams.usercars" :key="index" :gutter="20">
          <el-col :span="9">
            <el-select
                v-model="EditParams.usercars[index].cid"
                class="m-2"
                placeholder="bind car"
            >
              <el-option
                  v-for="item in Cars"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="9">
            <el-input v-model="EditParams.usercars[index].car_lp" />
          </el-col>
          <el-col :span="6">
            <el-button @click="remove(index)" type="danger">删除车辆</el-button>
          </el-col>
        </el-row>
      </el-row>
      <div v-if="TableProps.EditTxt.value !== '添加'" class="w-full flex-row flex-center">
        <el-button @click="bindCar" type="success">绑定车辆</el-button>
      </div>
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
          width="50"
      />
      <el-table-column
          prop="username"
          label="客户名称"
          header-align="center"
          align="center"
      />
      <el-table-column
          prop="usercars"
          label="客户车辆"
          header-align="center"
          align="center"
      >
        <template #default="{ row }">
          <el-row class="mt-5" :gutter="20" v-for="(item, index) in row.usercars" :key="index">
            <el-col :span="12">
              <el-input v-model="item.car_name" disabled />
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.car_lp" disabled />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
          prop="create_time"
          label="创建时间"
          header-align="center"
          align="center"
      >
        <template #default="{ row }">
          <showTime :date="row.create_time" />
        </template>
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          header-align="center"
          align="center"
      >
        <template #default="{ row }">
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
import { user } from "@/Request/ApiModules/mongodb/user";
import { useTableFunction } from "@/components/TableFunction/useTableFunction";
import { onMounted, ref } from "vue";
import car from "@/Request/ApiModules/mongodb/car";
import { ElMessage } from "element-plus";

//添加修改对象
const EditParams = ref({
  username: "",
  usercars: []
});
//查询对象
const QueryParams = ref({
  username: ""
});

const TableProps = useTableFunction(
    "客户",
    user,
    QueryParams,
    EditParams,
    undefined,
);
const Cars = ref();
const { isEdit, DataSource, TableLoading, total , EditTxt, EditLoading } = TableProps;

const loadCar = () => {
  car.all().then( res => {
    Cars.value = res.data.data.list;
  }).catch( error => ElMessage.error(error));
}

const bindCar = () => {
  EditParams.value.usercars.push({
    car_lp: "车牌号",
    cid: undefined
  })
}

const remove = (index: number) => {
  EditParams.value.usercars.splice(index, 1);
}

onMounted( async () => {
  TableProps.loadTableDatas();
  loadCar();
})

</script>
