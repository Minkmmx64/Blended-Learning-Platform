import { PaginationQuery } from "src/Modules/index.type";

// 返回排序参数
export function ToOrder<T = any>(PaginationQuery: PaginationQuery<T>) {
    const Order = PaginationQuery.order === "ascending" 
                  ? "ASC" : 
                  PaginationQuery.order === "descending" 
                          ? "DESC" : "ASC";
    return Order;
}