import { AxiosApi, ServerData } from "@/Request/AxiosApis";
import { Ref, ref } from "vue";
import { ElMessage } from "element-plus";
import { ChildProps, DeleteProps, EditProps, ITableFunction, KeyValue, ListMetaData, Pagination, PaginationQuery, Sorted, lazyFunc } from "./index.type";
import { DataModules } from "@/Request/DataModules/DataModules";
import { AxiosResponse } from "axios";
import { DeepClone } from "../Utils/deepClone";

interface IuseTreeTableFunction {
  //加载子树
  lazy: lazyFunc<KeyValue>;
  //子树属性
  childKey: ChildProps;
  //el-table key
  TreeTableKey: Ref<number>;
}

/**
 *  通用树形列表加载器
 *  后端返回数据结构:
 *  message: "请求消息",
 *  code: "状态码",
 *  data: {
 *    list: [],  list 拥有 pid 属性,通过pid对属性列表绑定
 *    meta: { ... }
 *  }
 * }
 * @param apiname
 * @param TableApi
 * @param UserSearchQuery
 * @param child
 * @param UserEditParam
 * @param PaginationQuery
 * @param life
 * @param transformData
 */
// 树形列表，指定 子列表props, 指定hasProps 懒加载
export function useTreeTableFunction<T extends AxiosApi, Query extends KeyValue, Edit extends KeyValue = any>(
  apiname: string,
  TableApi: new () => T,
  UserSearchQuery: Ref<Query>,
  child: ChildProps,
  UserEditParam: Ref<Edit>,                   // 用户添加&编辑表单
  PaginationQuery?: Sorted & Pagination,  // 分页请求参数 & 用户自定义请求参数
  life ?: {
    beforehandleEditConfirm?: () => void;
    beforehandleEditOpen?: (row?: Edit) => void;
  },
  transformData ?: new () => DataModules          // 前后端字段转换   class_id = "class.id" 后端class字段的id属性赋值给class_id
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
  const TableLoading = ref(false);
  //编辑框加载
  const EditLoading = ref(false);

  //设置当前是否正在编辑
  const isEdit = ref(false);
  //当前正在编辑的情况
  const EditTxt = ref<'修改' | '添加'>('修改');
  // 当前item id
  const id = ref<number | undefined>();
  // el-table
  const TreeNodeMap = new Map<number, any>();
  const TreeTableKey = ref(0);
  //合并查询参数
  const queryBuilder = () => {
    return Object.assign(UserSearchQuery.value, {
      limit: limit.value, 
      offset: offset.value, 
      prop: props.value, 
      order: order.value 
    });
  }
  //排除一些参数
  const editBuildr = () => {

    const data = DeepClone(UserEditParam.value);

    const edit = {} as any;
    for(const K in data) {
      if(K !== "pid") 
        edit[K] = DM.transformClientDataDataToServer(K, data);
    }
    return edit;
  }

  //数据模型
  const DM = transformData ? new transformData() : new DataModules();

  //表格加载数据
  const loadTableDatas = () => {
    TableLoading.value = true;
    useTableApi.get<PaginationQuery<Query>, ListMetaData<DataModules[]>>(`/list?date=${new Date().getTime()}`, queryBuilder()).then( res => {
      setTimeout(() => {
        DataSource.value = res.data.data.list;
        total.value = res.data.data.meta.total;
        for(let i = 0 ; i < DataSource.value.length; i++) {
          DataSource.value[i][childKey.childrenKey] = [];
          DataSource.value[i][childKey.hasChildrenKey] = true;
          DataSource.value[i]["index"] = i;
        }
        TableLoading.value = false;
        TreeTableKey.value++;
      }, 500);
    }).catch(error => { ElMessage.error(error); });
  }

  //渲染el-table子数据
  const lazy: lazyFunc<KeyValue> = (row, treeNode, resolve) => {
    TreeNodeMap.set(row.id, { row, treeNode, resolve, index: row.index });
    setTimeout( async() => {
      const data = await loadTreeNodeChildData(row);
      resolve(data);
    }, 100);
  }

  //通过pid加载子树
  const loadTreeNodeChildData = (row: KeyValue) : Promise<KeyValue[]> => {
    return new Promise((resolve, reject) => {
      useTableApi.get< any , ListMetaData<DataModules[]>>(`/list?d=${Math.random()}`,{
        pid: row.id,
        date: new Date().getTime(),
        limit: 999999,
        offset: 1,
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
    useTableApi.delete<DeleteProps>("/delete", { id: deleteNode.id }).then( (res: AxiosResponse<ServerData<any>, any>) => {
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
    }).catch( error => ElMessage.error(error));
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

  //排序
  const handleSortChange = (val: Sorted) => {
    props.value = val.prop;
    order.value = val.order;
    loadTableDatas();
  }

  //提交修改，添加
  const handleEditConfirm = () => {

    // 执行回调
    if(life && life.beforehandleEditConfirm) life.beforehandleEditConfirm();

    EditLoading.value = true;
    let Api: Promise<AxiosResponse<ServerData<any>, any>>;
    if(EditTxt.value === "添加") {
      Api = useTableApi.post<Edit>("/create", UserEditParam.value );
    } else {
      Api = useTableApi.put<{ id: number, data: Edit }>("/update", { id: id.value!, data:  editBuildr() });
    }
    Api.then( res => {
      setTimeout(() => {
        ElMessage.success(`${EditTxt.value} ${apiname} 成功`);
        EditLoading.value = false;
        handleEditClose();
        loadTableDatas();
      }, 500);
    }).catch( error => {
      //ElMessage.error(error);
      TableLoading.value = false;
      EditLoading.value = false;
      //handleEditClose();
    });
  }

  const handleEditClose = () => {
    isEdit.value = false;
  }

  const handleEditOpen = (type: EditProps, row?: KeyValue) => {
    
    if(life && life.beforehandleEditOpen) {
      if(typeof life.beforehandleEditOpen === "function"){
        life.beforehandleEditOpen(row as Edit);
      }
    }

    isEdit.value = true;
    if(row) {
      id.value = row.id;
      for(const K in UserEditParam.value) {
        UserEditParam.value[K] = DM.transformServiceDataToClient(K, row);
        if(K === "pid") UserEditParam.value[K] = row["id"];
      }
    } else {
      for(const K in UserEditParam.value) {
        (UserEditParam.value[K] as any) = undefined;
      }
    }
    if(type === "create") {
      EditTxt.value = "添加";
    } else EditTxt.value = "修改";
  }

  const handleClearQuery = () => {
    for(const k in UserSearchQuery.value) {
      if(typeof UserSearchQuery.value[k] === "number") 
        (UserSearchQuery.value[k] as any) = undefined;
      else 
        (UserSearchQuery.value[k] as any) = "";
    }
    loadTableDatas();
  }

  return { 
    apiname,
    loadTableDatas,
    DataSource, 
    lazy, 
    childKey, 
    handleDelete, 
    TreeTableKey, 
    TableLoading, 
    EditLoading,
    total, 
    isEdit, 
    handleEditClose, 
    handleEditConfirm, 
    handleEditOpen, 
    EditTxt,
    handleSizeChange,
    handleCurrentChange,
    handleSortChange,
    handleClearQuery
  }
}