import { Injectable } from '@nestjs/common';
import { MenuCreateDTO, MenuQueryDTO } from './menu.dto';
import { DataSource, InsertResult } from 'typeorm';
import { MenuDAO } from './menu.dao';
import { PaginationQuery } from '../index.type';
import { RootRouters } from 'src/Entity/root_routers.entity';


@Injectable()
export class MenuService {

  constructor(public DataSource: DataSource){}

  public MenuDAO = new MenuDAO(this.DataSource);

  public async MenuCreate(menu: MenuCreateDTO) : Promise<[ Error, InsertResult]>{
    try {
      const ok = await this.MenuDAO.MenuCteate(menu);
      return [ null, ok ];
    } catch (error) {
      console.log(error);
      return [ new Error(error), null ];
    }
  }

  public async MenuListsPagination(MenuQuery: PaginationQuery<MenuQueryDTO>): Promise<[Error, RootRouters[]]> {
    try {
      const Menus = await this.MenuDAO.MenuListsPagination(MenuQuery);
      return [ null, Menus ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}
