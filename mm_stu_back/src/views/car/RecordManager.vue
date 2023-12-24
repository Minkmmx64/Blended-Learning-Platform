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
              v-model="QueryParams.servename"
              placeholder="serve servename"
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
            <span>{{ TableProps.apiname }}选择服务:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-select
              v-model="EditParams.serve_id"
              class="m-2"
              placeholder="bind car"
          >
            <el-option
                v-for="item in allserve"
                :key="item.id"
                :label="item.servename"
                :value="item.id"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}选择用户:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-select
              v-model="EditParams.user_id"
              class="m-2"
              placeholder="bind car"
          >
            <el-option
                v-for="item in alluser"
                :key="item.id"
                :label="item.username"
                :value="item.id"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row v-if="EditParams.user_id" class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}选择车辆信息:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-select
              v-model="s_car_id"
              class="m-2"
              placeholder="bind car"
          >
            <el-option
                v-for="(item, index) in usercars"
                :key="item.cid"
                :label="`${item.car_name} ${item.car_lp}`"
                :value="index"
            />
          </el-select>
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
          width="50"
      />
      <el-table-column
          prop="username"
          label="用户"
          header-align="center"
          align="center"
      />
      <el-table-column
          prop="car_name"
          label="车辆品牌"
          header-align="center"
          align="center"
      />
      <el-table-column
          prop="car_lp"
          label="车牌号"
          header-align="center"
          align="center"
      />
      <el-table-column
          prop="user_serve.servename"
          label="服务项目"
          header-align="center"
          align="center"
      />
      <el-table-column
          prop="user_serve.waiter"
          label="接待人"
          header-align="center"
          align="center"
      />
      <el-table-column
          prop="user_serve.fee"
          label="实际收费"
          header-align="center"
          align="center"
      />
      <el-table-column
          prop="create_time"
          label="服务时间"
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
<!--          <el-button-->
<!--              type="success"-->
<!--              @click="TableProps.handleEditOpen('update', row)"-->
<!--          >-->
<!--            编辑-->
<!--          </el-button>-->
<!--          <el-divider direction="vertical" />-->
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
import { record } from "@/Request/ApiModules/mongodb/record";
import user from "@/Request/ApiModules/mongodb/user";
import serve from "@/Request/ApiModules/mongodb/serve";
import { useTableFunction } from "@/components/TableFunction/useTableFunction";
import {onMounted, ref, watchEffect} from "vue";

//添加修改对象
const EditParams = ref({
  serve_id: undefined,
  user_id: undefined,
  car_id: undefined,
  car_lp: ""
});
//查询对象
const QueryParams = ref({

});

const TableProps = useTableFunction(
    "服务记录",
    record,
    QueryParams,
    EditParams,
    undefined,
    {
      afterhandleEditConfirm() {
        s_car_id.value = undefined;
      }
    }
);

const usercars = ref([]);
const allserve = ref([]);
const alluser = ref([]);
const s_car_id = ref<number>();

watchEffect(() => {
  if(EditParams.value.user_id !== undefined && alluser.value.length) {
    usercars.value = alluser.value.find(v => v.id === EditParams.value.user_id).usercars;
  } else usercars.value = [];
})

watchEffect(() => {
  if(s_car_id.value >= 0) {
    try {
      const i = s_car_id.value;
      EditParams.value.car_id = usercars.value[i].cid;
      EditParams.value.car_lp = usercars.value[i].car_lp;
    } catch (e) {}
  }
})

const { isEdit, DataSource, TableLoading, total , EditTxt, EditLoading } = TableProps;

onMounted( async () => {
  TableProps.loadTableDatas();
  serve.all().then( res => {
    allserve.value = res.data.data.list;
  });
  user.all().then(res => {
    alluser.value = res.data.data.list;
  });
})

</script>
