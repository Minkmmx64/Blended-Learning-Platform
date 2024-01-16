import { PaginationQuery } from "src/Modules/index.type";
import { Express } from 'express';
import * as spark from "spark-md5";
// 返回排序参数
export function ToOrder<T = any>(PaginationQuery: PaginationQuery<T>) {
    const Order = PaginationQuery.order === "ascending" 
                  ? "ASC" : 
                  PaginationQuery.order === "descending" 
                          ? "DESC" : "ASC";
    return Order;
}

//文件上传
export async function ReadFile(file: Express.Multer.File): Promise<string> {
  const read = new spark.ArrayBuffer();
  read.append(file.buffer);
  const md5 = read.end();
  return md5;
}