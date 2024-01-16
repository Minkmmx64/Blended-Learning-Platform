import { Injectable } from '@nestjs/common';
import { MenuCreateDTO, MenuQueryDTO, MenuUpdateDTO } from './menu.dto';
import { DataSource, DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { MenuDAO } from './menu.dao';
import { ListMetaData, PaginationQuery, ServiceData } from '../../index.type';
import { RootRouters } from 'src/Entity/root_routers.entity';


@Injectable()
export class MenuService {

  constructor(public DataSource: DataSource){}

  public MenuDAO = new MenuDAO(this.DataSource);
  
  public async MenuCreate(menu: MenuCreateDTO) : ServiceData<InsertResult>{
    try {
      const ok = await this.MenuDAO.MenuCteate(menu);
      return [ null, ok ];
    } catch (error) {
      return [ new Error(error), null ];
    }
  }

  public async MenuListsPagination(MenuQuery: PaginationQuery<MenuQueryDTO>): ServiceData<ListMetaData<RootRouters[]>> {
    try {
      const Menus = await this.MenuDAO.MenuListsPagination(MenuQuery);
      const res: ListMetaData<RootRouters[]> = {
        list: Menus,
        meta: {
          total: await this.MenuDAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async MenuDelete(id: number): ServiceData<DeleteResult> {
    try {
      const DeleteResult = await this.MenuDAO.DeleteMenuById(id);
      return [ null, DeleteResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async MenuUpdate(MenuUpdate: MenuUpdateDTO): ServiceData<UpdateResult> {
    try {
      const UpdateResult = await this.MenuDAO.UpdateMenuById(MenuUpdate);
      return [ null, UpdateResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async MenuAll() : ServiceData<RootRouters[]> {
    try {
      const all = await this.MenuDAO.MenuAll();
      return [ null, all ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}
