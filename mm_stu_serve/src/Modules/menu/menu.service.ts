import { Injectable } from '@nestjs/common';
import { MenuCreateDTO } from './menu.dto';
import { DataSource, InsertResult } from 'typeorm';
import { MenuDAO } from './menu.dao';


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
}
