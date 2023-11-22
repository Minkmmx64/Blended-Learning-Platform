import { AxiosApi } from "@/Request/AxiosApis";
import { ElMessage } from "element-plus";
import { Ref, ref } from "vue";

//分页参数 默认第一页，一页10条
export interface Pagination {
  limit: number;     //当前一页条目
  offset: number;    //页偏移量
}

export interface Sorted {
  order?: "descending" | "ascending" | null,
  prop?: string;
}

//合并参数
export type PaginationQuery<T> = Sorted & Pagination & T;

//表格方法返回体
export interface ITableFunction {
  TableData: Ref<object[]>;
  loadTableDatas: () => void;
}

export function useTableFunction<T extends AxiosApi, Query extends object>(
  TableApi: new () => T,
  UserSearchQuery: Query,
  PaginationQuery?: Sorted & Pagination  // 分页请求参数 & 用户自定义请求参数
) : ITableFunction {
  const useTableApi = new TableApi();
  const TableData = ref<object[]>([]);

  const limit = PaginationQuery?.limit ?? 10;
  const offset = PaginationQuery?.offset ?? 1;
  const props = PaginationQuery?.prop;
  const order = PaginationQuery?.order;

  const Query = Object.assign(UserSearchQuery, { limit, offset, props, order })

  const loadTableDatas = () => {
    useTableApi.get<PaginationQuery<Query>, object[]>("/list", Query).then( res => {
      TableData.value = res.data.data;
    }).catch(error => { ElMessage.error(error); });
  }

  return { TableData, loadTableDatas }
}