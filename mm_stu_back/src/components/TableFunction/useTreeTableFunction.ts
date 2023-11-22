import { AxiosApi } from "@/Request/AxiosApis";
import { Ref, ref } from "vue";
import { ElMessage } from "element-plus";
import { ChildProps, ITableFunction, KeyValue, Pagination, PaginationQuery, Sorted, lazyFunc } from "./index.type";

interface IuseTreeTableFunction {
  lazy: lazyFunc;
  childKey: ChildProps;
}



// 树形列表，指定 子列表props, 指定hasProps 懒加载
export function useTreeTableFunction<T extends AxiosApi, Query extends KeyValue>(
  TableApi: new () => T,
  UserSearchQuery: Query,
  child: ChildProps,
  PaginationQuery?: Sorted & Pagination,  // 分页请求参数 & 用户自定义请求参数
) : IuseTreeTableFunction & ITableFunction {
  const useTableApi = new TableApi();
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
  

  const loadTableDatas = () => {
    useTableApi.get<PaginationQuery<Query>, KeyValue[]>("/list", query).then( res => {
      DataSource.value = res.data.data;
      for(const data of DataSource.value) {
        data[childKey.childrenKey] = [];
        data[childKey.hasChildrenKey] = true;
      }
      console.log(DataSource.value);
      
    }).catch(error => { ElMessage.error(error); });
  }

  const lazy: lazyFunc = (e) => {
    console.log(e);
  }

  return { loadTableDatas, DataSource, lazy, childKey }
}