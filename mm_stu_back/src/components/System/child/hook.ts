import { Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { config, SystemMenus } from "../AdminSystemLayout";
import { ISystemMenus, MenuItem } from "../AdminSystemLayout.type";

interface IuseBreadNav {
  selectMenu: (indexPath: string[], index: string) => void;
  BreadNavPath: Ref<ISystemMenus[]>;
  togglecollapse: () => void;
  collapse: Ref<boolean>;
  currentMenu: Ref<string>;
  togglemenu: (key:string) => void;
}

interface IuseMenu {
  MenuWidth: Ref<number>,
  MenuDrag: (el: HTMLElement) => void;
}

const useMenu = (): IuseMenu => {
  const Router = useRouter();
  const MenuWidth = ref(config.width);
  const MenuDrag = (el : HTMLElement) => {
    let dx: number;
    const mousemove = (e : MouseEvent) => { if(dx) MenuWidth.value = e.screenX >= config.width ? (e.screenX >= 1000 ? 1000 : e.screenX ) : config.width; }
    el.addEventListener("mousedown", e => {
      dx = e.screenX;
      document.addEventListener("mousemove", mousemove);
    });
    document.addEventListener("mouseup", () =>  document.removeEventListener("mousemove", mousemove) )
  }

  return {
    MenuWidth,
    MenuDrag,
  }
}

const useBreadNav = (MenuWidth: Ref<number>): IuseBreadNav => {
  const currentMenu = ref(config.default_menu);
  //初始化首页,因为首页可能在子菜单里,默认加载主菜单的第一个没有subMenu的子菜单
  const LodashBreadNavPath = () : ISystemMenus[] => {
    let DefaultBreadNavPath : MenuItem = SystemMenus.find( e => e.key === config.default_menu)!;
    const Result = [] as ISystemMenus[];
    Result.push({
      name:  DefaultBreadNavPath.name,
      route: DefaultBreadNavPath.route,
      key:   DefaultBreadNavPath.key,
      icon:  DefaultBreadNavPath.icon,
    })
    while(DefaultBreadNavPath.subMenu){
      DefaultBreadNavPath = DefaultBreadNavPath.subMenu[0];
      Result.push({
        name:  DefaultBreadNavPath.name,
        route: DefaultBreadNavPath.route,
        key:   DefaultBreadNavPath.key,
        icon:  DefaultBreadNavPath.icon,
      })
    }
    currentMenu.value = Result[Result.length - 1].key;
    return Result;
  }
  const Router = useRouter();
  const BreadNavPath = ref<ISystemMenus[]>(LodashBreadNavPath());
  const collapse = ref(false);
  const selectMenu = (indexPath: string[], index: string) => {
    const MenuItems = [] as ISystemMenus[];
    let SubMenuGroup = SystemMenus;
    for(let i = 0 ; i < indexPath.length; i++){
      const Menu = SubMenuGroup.find(e => e.key === indexPath[i])!;
      MenuItems.push({
        name:  Menu.name,
        route: Menu.route,
        key:   Menu.key,
        icon:  Menu.icon,
      });
      if(Menu.subMenu) SubMenuGroup = Menu.subMenu;
    }
    BreadNavPath.value = MenuItems;
    currentMenu.value = index;
    //菜单点击的路由切换由 配置项的 key 决定
    Router.push({name: index});
    //console.log(BreadNavPath.value);
  }
  const togglecollapse = () => {
    collapse.value = !collapse.value;
    if(collapse.value) MenuWidth.value = 60;
    else MenuWidth.value = 250;
  };
  const togglemenu = (key: string) => {
    const RootList: number[] = [];
    const MenuLists: ISystemMenus[] = [];
    const KeyPath: string[] = [];
    let idx = 0, KeyPathIndex = 0;
    const dfs = (Menus: ISystemMenus[], root: number) => {
      for(let i = 0 ; i < Menus.length; i++){
        const MenuItem = Menus[i];
        RootList[++idx] = root;
        MenuLists[idx] = MenuItem;
        if(MenuItem.key === key) return KeyPathIndex = idx;
        else if(MenuItem.subMenu) dfs(MenuItem.subMenu, idx); 
      }
    }
    dfs(SystemMenus, 0);
    while(KeyPathIndex != 0){
      KeyPath.push(MenuLists[KeyPathIndex].key);
      KeyPathIndex = RootList[KeyPathIndex];
    }
    selectMenu(KeyPath.reverse(), key);
  }
  return {
    BreadNavPath,
    selectMenu,
    togglecollapse,
    collapse,
    currentMenu,
    togglemenu,
  }
}

export { useBreadNav, useMenu };