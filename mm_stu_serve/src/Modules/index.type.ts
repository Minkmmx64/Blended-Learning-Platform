interface Pagination {
  limit: number;     //当前一页条目
  offset: number;    //页偏移量
}

interface Sorted {
  order?: "descending" | "ascending" | null,
  prop?: string;
}

export type PaginationQuery<T> = Sorted & Pagination & T;

export type ServiceData<T> = Promise<[Error, T]>;

export interface CommonData {
  status?: boolean;
  remark?: string;
}

export type ListMetaData<T, META = any> = {
  list: T;
  meta: META
}