import { RootStackParamList, RootTabParamList } from "../../navigator";
import { UtilToolsBaseProps } from "../compoment/UtilTools";

//判断跳转的路由类型
interface NavType<T> {
  type: T;
  url: T extends "tab" ? keyof RootTabParamList : keyof RootStackParamList;
}
 
type getNavType<T extends "stack" | "tab"> = NavType<T>;

export interface IUtilTools extends UtilToolsBaseProps { 
  nav: getNavType<"stack"> | getNavType<"tab">;
}