import { AxiosApi } from "@/Request/AxiosApis";
import { Ref, ref } from "vue";
import { ElMessage } from "element-plus";
import { ChildProps, ITableFunction, KeyValue, Pagination, PaginationQuery, Sorted, lazyFunc } from "./index.type";
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
export function useTreeTableFunction<T extends AxiosApi, Query extends KeyValue>(
  TableApi: new () => T,
  UserSearchQuery: Query,
  child: ChildProps,
  PaginationQuery?: Sorted & Pagination  // 分页请求参数 & 用户自定义请求参数
) : IuseTreeTableFunction & ITableFunction {
  const useTableApi = new TableApi();

  const TreeTableKey = ref(0);
  const DataSource = ref<KeyValue[]>([]);

  const limit = PaginationQuery?.limit ?? 10;
  const offset = PaginationQuery?.offset ?? 1;
  const props = PaginationQuery?.prop;
  const order = PaginationQuery?.order;

  const query = Object.assign(UserSearchQuery, { limit, offset, props, order });

  const childKey : ChildProps = {
    hasChildrenKey: child.hasChildrenKey ?? "hasChildren",
    childrenKey: child.childrenKey ?? "children"
  }
  
  // ----------
  const TreeNodeMap = new Map<number, any>();

  // ----------

  //表格加载数据
  const loadTableDatas = () => {
    useTableApi.get<PaginationQuery<Query>, DataModules[]>(`/list?date=${new Date().getTime()}`, query).then( res => {
      DataSource.value = res.data.data;
      for(let i = 0 ; i < DataSource.value.length; i++) {
        DataSource.value[i][childKey.childrenKey] = [];
        DataSource.value[i][childKey.hasChildrenKey] = true;
        DataSource.value[i]["index"] = i;
      }
    }).catch(error => { ElMessage.error(error); });
  }

  //加载子数据， pid = id
  const lazy: lazyFunc<KeyValue> = (row, treeNode, resolve) => {
    TreeNodeMap.set(row.id, { row, treeNode, resolve, index: row.index });
    setTimeout( async() => {
      const data = await loadTreeNodeChildData(row);
      resolve(data);
    }, 500);
    console.log(row, treeNode);
  }

  const loadTreeNodeChildData = (row: KeyValue) : Promise<KeyValue[]> => {
    return new Promise((resolve, reject) => {
      useTableApi.get<PaginationQuery<Query>, DataModules[]>(`/list?d=${Math.random()}`,{
        ...query,
        pid: row.id,
        date: new Date().getTime()
      }).then( res => {
        const ChildData = ref(res.data.data as KeyValue[]);
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

  return { loadTableDatas, DataSource, lazy, childKey, handleDelete, TreeTableKey }
}