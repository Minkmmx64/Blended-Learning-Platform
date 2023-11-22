import { AxiosApi } from "@/Request/AxiosApis";
import { ElMessage } from "element-plus";
import { Ref, ref } from "vue";
import { ITableFunction, Pagination, PaginationQuery, Sorted } from "./index.type";

export function useTableFunction<T extends AxiosApi, Query extends object>(
  TableApi: new () => T,
  UserSearchQuery: Query,
  PaginationQuery?: Sorted & Pagination  // 分页请求参数 & 用户自定义请求参数
) : ITableFunction {
  const useTableApi = new TableApi();
  const DataSource = ref<object[]>([]);

  const limit = PaginationQuery?.limit ?? 10;
  const offset = PaginationQuery?.offset ?? 1;
  const props = PaginationQuery?.prop;
  const order = PaginationQuery?.order;

  const query = Object.assign(UserSearchQuery, { limit, offset, props, order })

  const loadTableDatas = () => {
    useTableApi.get<PaginationQuery<Query>, object[]>(`/list?date=${new Date().getTime()}`, query).then( res => {
      DataSource.value = res.data.data;
    }).catch(error => { ElMessage.error(error); });
  }

  return { DataSource, loadTableDatas }
}