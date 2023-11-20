import { DataSource, SelectQueryBuilder } from "typeorm";
import { MenuCreateDTO, MenuQueryDTO } from "./menu.dto";
import { RootRouters } from "src/Entity/root_routers.entity";
import { PaginationQuery } from "../index.type";


export class MenuDAO {
  constructor(protected DataSource : DataSource){};

  public MenuRepository = this.DataSource.getRepository(RootRouters);

  public async MenuCteate(MenuCreate : MenuCreateDTO) {
    return await this.MenuRepository.insert({
      name: MenuCreate.name,
      key: MenuCreate.key,
      pid: MenuCreate.pid ?? null
    });
  }

  public async MenuListsPagination(MenuQuery: PaginationQuery<MenuQueryDTO>) {
    const Order = MenuQuery.order === "ascending" 
                  ? "ASC" : 
                          MenuQuery.order === "descending" 
                          ? "DESC" : "ASC";

    const SelectQueryBuilder: SelectQueryBuilder<RootRouters> = this.MenuRepository.createQueryBuilder().select()
    if(MenuQuery.name){
      SelectQueryBuilder
                        .where("name = :name")
                        .setParameter("name", MenuQuery.name);
    }
    if(MenuQuery.pid){
      SelectQueryBuilder
                        .andWhere("pid = :pid")
                        .setParameter("pid", MenuQuery.pid);
    }
    return await SelectQueryBuilder
                                   .orderBy(MenuQuery.prop, Order)
                                   .skip(MenuQuery.limit * (MenuQuery.offset - 1))
                                   .take(MenuQuery.limit)
                                   .getMany();
  }
}