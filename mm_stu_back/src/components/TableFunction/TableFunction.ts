import { AxiosApi } from "@/Request/AxiosApis";
import { PaginationQuery } from "./useTableFunction";
import { ref } from "vue";
import { ElMessage } from "element-plus";


export function TableFunction<T extends AxiosApi, Query extends object>(
  Api: T,
  Query: PaginationQuery<Query>
) {

  const TableData = ref();

  const loadTableDatas = () => {
    Api.get<PaginationQuery<Query>, object[]>("/list", Query).then( res => {
      TableData.value = res.data.data;
    }).catch(error => { ElMessage.error(error); });
  }

  return {
    loadTableDatas,
    TableData
  }
}