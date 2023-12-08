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
        <!-- <el-col :span="6">
          <el-input
            v-model="QueryParams.name"
            placeholder="class name"
          />
        </el-col>
        <el-col :span="6">
          
        </el-col> -->
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
      <!-- <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}名称:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.name"
            placeholder="class name"
          />
        </el-col>
      </el-row> -->
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
        label="用户名"
        header-align="center"
        align="center"
        width="200"
      />
      <el-table-column
        prop="phone"
        label="手机号"
        header-align="center"
        align="center"
        width="200"
      />
      <el-table-column
        prop="avatar"
        label="用户头像"
        header-align="center"
        align="center"
        width="100"
      >
        <template #default="{ row }">
          <el-image
            style="width: 50px; height: 50px"
            :src="row.avatar"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :initial-index="4"
            :preview-teleported="true"
            :preview-src-list="[row.avatar]"
            fit="cover"
            :hide-on-click-modal="true"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="role.name"
        label="角色"
        header-align="center"
        align="center"
        width="200"
      />
      <el-table-column
        prop="label"
        label="标签"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="remark"
        label="描述"
        header-align="center"
        align="center"
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
        width="300"
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
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { root } from "@/Request/ApiModules/root";
import { useTableFunction } from "@/components/TableFunction/useTableFunction";
const QueryParams = ref({

});

const EditParams = ref({

})

const TableProps = useTableFunction("系统用户", root, QueryParams, EditParams )

const { isEdit, DataSource, TableLoading, total , EditTxt, EditLoading } = TableProps;

onMounted(() => {
  TableProps.loadTableDatas();
})
</script>
  
<style lang="scss" scoped>
  
</style>