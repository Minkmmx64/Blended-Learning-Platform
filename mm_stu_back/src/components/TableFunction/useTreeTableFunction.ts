import { AxiosApi } from "@/Request/AxiosApis";
import { Ref, ref } from "vue";
import { ElMessage } from "element-plus";
import { ChildProps, EditProps, ITableFunction, KeyValue, ListMetaData, Pagination, PaginationQuery, Sorted, lazyFunc } from "./index.type";
import { DataModules } from "@/Request/DataModules/DataModules";

interface IuseTreeTableFunction {
  lazy: lazyFunc<KeyValue>;
  childKey: ChildProps;
  handleDelete: (row: DataModules) => void;
  TreeTableKey: Ref<number>;
}

type DeleteProps<T = unknown> = {
  [K in keyof T]: any;
} & {
  id: number;
};

// 树形列表，指定 子列表props, 指定hasProps 懒加载
export function useTreeTableFunction<T extends AxiosApi, Query extends KeyValue, Edit extends object = any>(
  apiname: string,
  TableApi: new () => T,
  UserSearchQuery: Query,
  child: ChildProps,
  UserEditParam: Ref<Edit>,                   // 用户添加&编辑表单
  PaginationQuery?: Sorted & Pagination  // 分页请求参数 & 用户自定义请求参数
) : IuseTreeTableFunction & ITableFunction {
  //分页参数
  const limit = ref(PaginationQuery?.limit ?? 10);
  const offset = ref(PaginationQuery?.offset ?? 1);
  const props = ref(PaginationQuery?.prop);
  const order = ref(PaginationQuery?.order);
  //分页参数

  //树形列表Key关键字
  const childKey : ChildProps = {
    hasChildrenKey: child.hasChildrenKey ?? "hasChildren",
    childrenKey: child.childrenKey ?? "children"
  }
  //表格Api
  const useTableApi = new TableApi();
  //数据源
  const DataSource = ref<KeyValue[]>([]);
  const total = ref(0);
  //表格加载动画 
  const loading = ref(false);
  //设置当前是否正在编辑
  const isEdit = ref(false);
  //当前正在编辑的情况
  const EditTxt = ref<'修改' | '添加'>('修改');

  //合并查询参数
  const queryBuilder = () => {
    const query = Object.assign(UserSearchQuery, 
      {
        limit: limit.value, 
        offset: offset.value, 
        prop: props.value, 
        order: order.value 
      });
    return query;
  }
  
  // ----------
  const TreeNodeMap = new Map<number, any>();
  const TreeTableKey = ref(0);
  // ----------

  //表格加载数据
  const loadTableDatas = () => {
    loading.value = true;
    useTableApi.get<PaginationQuery<Query>, ListMetaData<DataModules[]>>(`/list?date=${new Date().getTime()}`, queryBuilder()).then( res => {
      setTimeout(() => {
        DataSource.value = res.data.data.list;
        total.value = res.data.data.meta.total;
        for(let i = 0 ; i < DataSource.value.length; i++) {
          DataSource.value[i][childKey.childrenKey] = [];
          DataSource.value[i][childKey.hasChildrenKey] = true;
          DataSource.value[i]["index"] = i;
        }
        loading.value = false;
        TreeTableKey.value++;
      }, 500);
    }).catch(error => { ElMessage.error(error); });
  }

  //加载子数据， pid = id
  const lazy: lazyFunc<KeyValue> = (row, treeNode, resolve) => {
    TreeNodeMap.set(row.id, { row, treeNode, resolve, index: row.index });
    setTimeout( async() => {
      const data = await loadTreeNodeChildData(row);
      resolve(data);
    }, 500);
  }

  const loadTreeNodeChildData = (row: KeyValue) : Promise<KeyValue[]> => {
    return new Promise((resolve, reject) => {
      useTableApi.get<PaginationQuery<Query>, ListMetaData<DataModules[]>>(`/list?d=${Math.random()}`,{
        ...queryBuilder(),
        pid: row.id,
        date: new Date().getTime()
      }).then( res => {
        const ChildData = ref(res.data.data.list as KeyValue[]);
        for(let i = 0 ; i < ChildData.value.length; i++) {
          ChildData.value[i][childKey.childrenKey] = [];
          ChildData.value[i][childKey.hasChildrenKey] = true;
          ChildData.value[i]["index"] = i;
        }
        resolve(ChildData.value);
      }).catch( error => reject(error));
    })
  }

  //删除按钮
  const handleDelete = (deleteNode : DataModules) => {
    useTableApi.delete<DeleteProps>("/delete", { id: deleteNode.id }).then( res => {
      setTimeout( async () => {
        ElMessage.success("删除成功");
        loadTableDatas();
        if(deleteNode.pid && TreeNodeMap.get(deleteNode.pid)){
          const { resolve, row } = TreeNodeMap.get(deleteNode.pid);
          const data = await loadTreeNodeChildData(row);
          if(data.length < 1) {
            TreeNodeMap.delete(deleteNode.pid);
            TreeTableKey.value++;
         }
          resolve(data);
        }
      }, 500);
    })
  }

  //分页limit 改变
  const handleSizeChange = (val: number) => {
    limit.value = val;
    loadTableDatas();
  }

  //分页offset改变
  const handleCurrentChange = (val: number) => {
    offset.value = val;
    loadTableDatas();
  }

  const handleSortChange = (val: Sorted) => {
    props.value = val.prop;
    order.value = val.order;
    loadTableDatas();
    console.log(val);
  }

  const handleEditConfirm = () => {
    console.log(UserEditParam.value);
    console.log(EditTxt.value + "操作");
    
  }

  const handleEditClose = () => {
    isEdit.value = false;
  }

  const handleEditOpen = (type: EditProps, row: DataModules) => {
    isEdit.value = true;
    console.log(type, row);
    if(type === "create") {
      EditTxt.value = "添加";
    } else EditTxt.value = "修改";
  }

  return { 
    apiname,
    loadTableDatas,
    DataSource, 
    lazy, 
    childKey, 
    handleDelete, 
    TreeTableKey, 
    loading, 
    total, 
    isEdit, 
    handleEditClose, 
    handleEditConfirm, 
    handleEditOpen, 
    EditTxt,
    handleSizeChange,
    handleCurrentChange,
    handleSortChange
  }
}