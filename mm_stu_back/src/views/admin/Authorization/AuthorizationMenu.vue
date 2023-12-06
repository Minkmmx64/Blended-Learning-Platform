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
              添加{{ TableProps.apiname }}
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="QueryParams.name"
            placeholder="menu name"
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
            <span>菜单名称:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.name"
            placeholder="menu name"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>菜单key:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.key"
            placeholder="menu key"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>菜单描述:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.remark"
            placeholder="menu remark"
          />
        </el-col>
      </el-row>
      <el-row
        v-if="EditParams.pid"
        class="text-center"
      >
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>pid:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.pid"
            disabled
            placeholder="menu key"
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
      :child="TableProps.childKey" 
      :lazy-load="TableProps.lazy" 
      :loading="TableLoading" 
      :total="total" 
      :table-key="TreeTableKey"
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
        prop="name"
        label="路由名称"
        header-align="center"
        align="center"
        width="200"
      />
      <el-table-column
        prop="key"
        label="路由关键字"
        header-align="center"
        align="center"
        width="150"
      />
      <el-table-column
        prop="status"
        label="状态"
        sortable
        header-align="center"
        align="center"
        width="150"
      >
        <template #default="{ row }">
          <el-tag
            v-if="row.status"
            class="ml-2 select-none"
            type="success"
          >
            启用
          </el-tag>
          <el-tag
            v-else
            class="ml-2 select-none"
            type="danger"
          >
            禁用
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="描述"
        header-align="center"
        align="center"
        width="250"
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
        flex="right"
        label="操作"
        header-align="center"
        align="center"
      >
        <template #default="{ row }">
          <!---->
          <el-button
            type="primary"
            @click="TableProps.handleEditOpen('create', row)"
          >
            添加子菜单
          </el-button>
          <el-divider direction="vertical" />
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
import { menu, MenuEdit, MenuQuery } from "@/Request/ApiModules/menu";
import { useTreeTableFunction } from "@/components/TableFunction/useTreeTableFunction";
import { onMounted, ref } from "vue";

//添加修改对象
const EditParams = ref<MenuEdit>({
  name: "",
  key: "",
  pid: undefined,
  remark: ""
});

const QueryParams = ref<MenuQuery>({
  name: ""
});

const TableProps = useTreeTableFunction<menu, MenuQuery, MenuEdit>(
  "菜单",
  menu,
  QueryParams,
  { childrenKey: "child", hasChildrenKey: "hashChild" },
  EditParams
);
const { isEdit, DataSource, TableLoading, total, TreeTableKey , EditTxt, EditLoading } = TableProps;

onMounted(() => {
  TableProps.loadTableDatas();
})
</script>
