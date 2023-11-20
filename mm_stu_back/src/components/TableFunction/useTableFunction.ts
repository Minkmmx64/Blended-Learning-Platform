import { AxiosApi } from "@/Request/AxiosApis";
import { ElMessage } from "element-plus";
import { Ref, ref } from "vue";

export interface ITableFunction {
  TableData: Ref<any[]>;
  loadTableData: () => void;
}

//分页参数 默认第一页，一页10条
export interface Pagination {
  limit: number;     //当前一页条目
  offset: number;    //页偏移量
}

export interface Sorted {
  order?: "descending" | "ascending" | null,
  prop?: string;
}

export function useTableFunction<T extends AxiosApi>(
  TableApi: new () => T,
) : ITableFunction {
  const useTableApi = new TableApi();
  const TableData = ref([
    {
      id: 1,
      create_time: new Date(),
      update_time: new Date(),
      remark: "remark",
      status: 0,
      name: "name",
      key: "key",
      children: [
        {
          id: 2,
          create_time: new Date(),
          update_time: new Date(),
          remark: "remark",
          status: 1,
          name: "name",
          key: "key",
        }
      ]
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
  ]);

  const loadTableData = () => {
    useTableApi.get<Pagination & Sorted>("/list").then( res => {
      console.log(res.data.data);
    }).catch(error => {
      ElMessage.error(error);
    });
  }

  return {
    TableData,
    loadTableData
  }
}