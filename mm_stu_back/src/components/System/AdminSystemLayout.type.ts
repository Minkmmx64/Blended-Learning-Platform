export type ISystemMenus = MenuItem;

export type MenuGroup = MenuItem[];

export interface MenuItem {
  name: string;
  icon: string;
  key: string;
  route?: string;
  subMenu ?: MenuItem[];
}