import { DataModules } from "@/Request/DataModules/DataModules";
import { Ref } from "vue";

//分页参数 默认第一页，一页10条
export interface Pagination {
    limit: number;     //当前一页条目
    offset: number;    //页偏移量
}
//排序字段
export interface Sorted {
    order?: "descending" | "ascending" | null,
    prop?: string;
}
//删除属性
export type DeleteProps<T = unknown> = {
  [K in keyof T]: any;
} & {
  id: number;
};
//合并参数
export type PaginationQuery<T> = Sorted & Pagination & T;
//key-value 键值对
export interface KeyValue {
  [key: string]: any;
}
//el-table 懒加载方法
export type lazyFunc<T> =(row: T, treeNode: any, resolve: (date: T[]) => void) => void;

//树形列表child
export interface ChildProps {
  //子列表名称
  childrenKey: string;
  //懒加载bool字段名称
  hasChildrenKey: string;
}
//获取列表返回参数
export type ListMetaData<T, META = any> = {
  list: T;
  meta: META
}
//编辑，添加
export type EditProps = "create" | "update";
//表格方法返回体
export interface ITableFunction {
  DataSource: Ref<KeyValue[]>;
  apiname: string;
  TableLoading: Ref<boolean>;
  total: Ref<number>;
  isEdit: Ref<boolean>;
  EditTxt: Ref<'修改' | '添加'>;
  EditLoading: Ref<boolean>;
  loadTableDatas: () => void;
  handleEditClose: () => void;
  handleEditConfirm: () => void;
  handleEditOpen: (type: EditProps, row?: DataModules) => void;
  handleSizeChange: (limit: number) => void;
  handleCurrentChange: (offset: number) => void;
  handleSortChange: (sort: Sorted) => void;
  handleDelete: (row: DataModules) => void;
  handleClearQuery: () => void;
}