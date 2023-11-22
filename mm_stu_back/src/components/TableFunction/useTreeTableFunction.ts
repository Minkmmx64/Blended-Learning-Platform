import { AxiosApi } from "@/Request/AxiosApis";
import { Pagination, Sorted } from "./useTableFunction";
import { Ref, ref } from "vue";

interface IuseTreeTableFunction {
  lazyLoad : <T> (
    row: T,
    treeNode: unknown,
    resolve: (date: T[]) => void
  ) => void;
}

export function useTreeTableFunction<T extends AxiosApi, Query extends object>(
  TableApi: new () => T,
  UserSearchQuery: Query,
  PaginationQuery?: Sorted & Pagination  // 分页请求参数 & 用户自定义请求参数
): IuseTreeTableFunction {

  const TableData = ref();

  const lazyLoad = (
    row: any,
    treeNode: unknown,
    resolve: (date: any[]) => void
  ) => {
    console.log(row, treeNode);
    setTimeout(() => {
      resolve([
        {
          id: 1,
          create_time: new Date(),
          update_time: new Date(),
          remark: "remark",
          status: 1,
          name: "name",
          key: "key",
        },
        {
          id: 4,
          create_time: new Date(),
          update_time: new Date(),
          remark: "remark",
          status: 1,
          name: "name",
          key: "key",
        }
      ])
    }, 1000)
  }

  return { lazyLoad }
}