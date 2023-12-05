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
        <el-col :span="6">
          <el-input
            v-model="QueryParams.name"
            placeholder="role name"
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
            v-model="EditParams.name"
            placeholder="role name"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>角色描述:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.remark"
            placeholder="role remark"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>显示菜单列表:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-tree 
            ref="MenuTree"
            :default-expand-all="true"
            :props="filterProps('disabled')" 
            :data="MenuTreeData" 
            :node-key="'id'"
            :default-checked-keys="DefaultCheckedKeys"
            show-checkbox
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

    <el-dialog
      v-model="isView"
      :title="`显示-${TableProps.apiname}`"
      width="30%"
    >
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>显示菜单列表:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-tree 
            :default-expand-all="true"
            :props="filterProps()" 
            :data="MenuTreeData" 
            :node-key="'id'"
            :default-checked-keys="DefaultCheckedKeys"
            show-checkbox
          />
        </el-col>
      </el-row>
      <span class="dialog-footer">
        <el-button @click="closeView">取消</el-button>
      </span>
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
        prop="name"
        label="角色"
        header-align="center"
        align="center"
        width="200"
      />
      <el-table-column
        prop="routers"
        label="权限"
        header-align="center"
        align="center"
        width="100"
      >
        <template #default="{ row }">
          <el-link
            type="primary"
            @click="viewRoleMenus(row)"
          >
            查看权限
          </el-link>
        </template>
      </el-table-column>
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
import { role, RoleEdit, RoleQuery } from "@/Request/ApiModules/role";
import menu from "@/Request/ApiModules/menu";
import { useTableFunction } from "@/components/TableFunction/useTableFunction";
import { onMounted, ref } from "vue";
import { KeyValue } from "@/components/TableFunction/index.type";
import { DeepClone } from "@/components/Utils/deepClone";
//添加修改对象
const EditParams = ref<RoleEdit>({
  name: "",
  menus: [],
  remark: ""
});
//查询对象
const QueryParams = ref<RoleQuery>({
  name: ""
});

const TableProps = useTableFunction<role, RoleQuery, RoleEdit>(
  "角色",
  role,
  QueryParams,
  EditParams,
  undefined,
  {
    beforehandleEditConfirm: () => {
      if(MenuTree.value) {
        if(typeof MenuTree.value.getCheckedNodes === "function"){
          const selectMenus = MenuTree.value.getCheckedNodes() as KeyValue[];
          EditParams.value.menus = up(selectMenus, MenuAllData.value);
        }
      }
    },
    async beforehandleEditOpen(row) {
      if(!row) {
        DefaultCheckedKeys.value = [];
        return;
      }
      loadAllMenus();
      DefaultCheckedKeys.value = [... leaf(row)];
    },
  }
);

const { isEdit, DataSource, TableLoading, total , EditTxt, EditLoading } = TableProps;

//向下递归把列表 all 转化成一棵树 deep
const down = (deep:(KeyValue & { child?:KeyValue[]})[],all:KeyValue[]): KeyValue =>
  deep.map( pa => (pa.child = all.filter( ch => ch.pid === pa.id)) && pa.child.length > 0 && down(pa.child, all));
//通过pid向上递归,把结点所有id记录下来给后端
const up = (item:KeyValue[], all:KeyValue[]):number[]=>{
  const d = new Set<number>(item.map(i=>i.id));
  item.map(i =>{let pid = i.pid!;while(pid){if(all.find(d =>d.id===pid)){d.add(all.find(d=>d.id===pid)!.id);pid=all.find(d=>d.id===pid)!.pid!;}}})
  return [...d];
}
//获取路径上的叶子节点，没有child的节点
const leaf = (row: KeyValue) => {
  const res = row.routers.filter( (menu: { pid: KeyValue; }) => menu.pid === null);
  down(res, row.routers);
  const ret = new Set<number>();
  const lv = (o:KeyValue[])=>{o.map(tr=>{if(tr.child && tr.child.length > 0)lv(tr.child);else ret.add(tr.id);});}
  lv(res);
  return ret;
}

const isView = ref(false);
const MenuTreeData = ref<KeyValue[]>([]);
const MenuTree = ref<KeyValue | null>(null);
const MenuAllData = ref<KeyValue[]>([]);
const DefaultCheckedKeys = ref<number[]>([]);

const filterProps = (...arg: string[]) => {
  //children子名称列表,label显示数据
  const props: KeyValue = {
    label: ( data : KeyValue, node : any) => {
      return data.name;
    },
    children: 'child',
    disabled: () => {
      return true;
    }
  }
  const ret = DeepClone(props);
  arg.map( i => {
    if(Object.getOwnPropertyNames(props).includes(i)) delete ret[i];
  })
  return ret;
}

const viewRoleMenus = async (row : KeyValue) => {
  isView.value = true;
  loadAllMenus();
  DefaultCheckedKeys.value = [... leaf(row)];
}

const closeView = () => {
  isView.value = false;
}

const loadAllMenus = async () => {
  MenuAllData.value = (await menu.all()).data.data;
  const result = MenuAllData.value.filter( menu => menu.pid === null);
  down(result, MenuAllData.value);
  MenuTreeData.value = result;
}

onMounted( async () => {
  loadAllMenus();
  TableProps.loadTableDatas();
})
</script>
