import { AxiosApi, ServerData } from "@/Request/AxiosApis";
import { ElMessage } from "element-plus";
import { Ref, ref } from "vue";
import { DeleteProps, EditProps, ITableFunction, KeyValue, ListMetaData, Pagination, PaginationQuery, Sorted } from "./index.type";
import { DataModules } from "@/Request/DataModules/DataModules";
import { AxiosResponse } from "axios";

export function useTableFunction<T extends AxiosApi, Query extends KeyValue, Edit extends KeyValue>(
  apiname: string,
  TableApi: new () => T,
  UserSearchQuery: Ref<Query>,                // 用户查询参数
  UserEditParam: Ref<Edit>,                   // 用户添加&编辑表单
  PaginationQuery?: Sorted & Pagination,  // 分页请求参数 & 用户自定义请求参数
  life ?: {
    beforehandleEditConfirm?: () => void;
    beforehandleEditOpen?: (row?: KeyValue) => void;
  }
) : ITableFunction {
  //分页参数
  const limit = ref(PaginationQuery?.limit ?? 10);
  const offset = ref(PaginationQuery?.offset ?? 1);
  const props = ref(PaginationQuery?.prop);
  const order = ref(PaginationQuery?.order);
  //分页参数

  const useTableApi = new TableApi();

  const DataSource = ref<object[]>([]);
  const total = ref(0);

  const isEdit = ref(false);
  const EditTxt = ref<'修改' | '添加'>('修改');
  const TableLoading = ref(false);
  const EditLoading = ref(false);

  // 当前item id
  const id = ref<number | undefined>();

  //合并查询参数
  const queryBuilder = () => {
    const query = Object.assign(UserSearchQuery.value, 
      { 
        limit: limit.value, 
        offset: offset.value, 
        props: props.value, 
        order: order.value 
      });
    return query;
  }

  //表格加载数据
  const loadTableDatas = () => {
    TableLoading.value = true;
    useTableApi.get<PaginationQuery<Query>, ListMetaData<DataModules[]>>(`/list?date=${new Date().getTime()}`, queryBuilder()).then( res => {
      setTimeout(() => {
        DataSource.value = res.data.data.list;
        total.value = res.data.data.meta.total;
        TableLoading.value = false;
      }, 500);
    }).catch(error => { ElMessage.error(error); });
  }

  //删除按钮
  const handleDelete = (deleteNode : DataModules) => {
    useTableApi.delete<DeleteProps>("/delete", { id: deleteNode.id }).then( res => {
      setTimeout( async () => {
        ElMessage.success("删除成功");
        loadTableDatas();
      }, 500);
    }).catch( error => ElMessage.error(error));
  }

  const handleSizeChange = (val: number) => {
    limit.value = val;
    loadTableDatas();
  }

  const handleCurrentChange = (val: number) => {
    offset.value = val;
    loadTableDatas();
  }

  const handleSortChange = (val: Sorted) => {
    props.value = val.prop;
    order.value = val.order;
    loadTableDatas();
  }

  const handleEditClose = () => {
    isEdit.value = false;
  }

  const handleEditConfirm = () => {
    // 执行回调
    if(life && life.beforehandleEditConfirm) life.beforehandleEditConfirm();
    
    EditLoading.value = true;
    let Api: Promise<AxiosResponse<ServerData<any>, any>>;
    if(EditTxt.value === "添加") {
      Api = useTableApi.post<Edit>("/create", UserEditParam.value );
    } else {
      Api = useTableApi.put<{ id: number, data: Edit }>("/update", { id: id.value!, data:  UserEditParam.value });
    }
    Api.then( res => {
      setTimeout(() => {
        ElMessage.success(`${EditTxt.value} ${apiname} 成功`);
        EditLoading.value = false;
        handleEditClose();
        loadTableDatas();
      }, 500);
    }).catch( error => {
      ElMessage.error(error);
      TableLoading.value = false;
      EditLoading.value = false;
    });
  }

  const handleEditOpen = (type: EditProps, row?: KeyValue) => {
    if(life && life.beforehandleEditOpen) {
      if(typeof life.beforehandleEditOpen === "function"){
        life.beforehandleEditOpen(row);
      }
    }
    isEdit.value = true;
    if(row) {
      id.value = row.id;
      for(const K in UserEditParam.value) {
        if(row[K])
          UserEditParam.value[K] = row[K];
      }
    } else {
      for(const K in UserEditParam.value) {
        (UserEditParam.value[K] as any) = typeof UserEditParam.value[K] === "object" ? UserEditParam.value[K] : undefined;
      }
    }
    if(type === "create") {
      EditTxt.value = "添加";
    } else {
      EditTxt.value = "修改";
    }
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
    DataSource, 
    loadTableDatas, 
    TableLoading, 
    total, 
    isEdit, 
    handleEditClose, 
    handleEditConfirm, 
    handleEditOpen, 
    EditTxt, 
    handleCurrentChange,
    handleSizeChange,
    handleSortChange,
    EditLoading,
    handleDelete,
    handleClearQuery
  }
}