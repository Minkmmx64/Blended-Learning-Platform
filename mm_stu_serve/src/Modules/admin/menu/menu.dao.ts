import { DataSource, SelectQueryBuilder } from "typeorm";
import { MenuCreateDTO, MenuQueryDTO, MenuUpdateDTO } from "./menu.dto";
import { RootRouters } from "src/Entity/root_routers.entity";
import { PaginationQuery } from "../../index.type";
import { ToOrder } from "src/common/common";

export class MenuDAO {
  constructor(protected DataSource : DataSource){};

  public MenuRepository = this.DataSource.getRepository(RootRouters);

  public async MenuCteate(MenuCreate : MenuCreateDTO) {
    return await this.MenuRepository.insert({
      name: MenuCreate.name,
      key: MenuCreate.key,
      pid: MenuCreate.pid ?? null,
      remark: MenuCreate.remark
    });
  }

  public async MenuListsPagination(MenuQuery: PaginationQuery<MenuQueryDTO>) : Promise<RootRouters[]> {
    const Order = ToOrder(MenuQuery);

    const SelectQueryBuilder: SelectQueryBuilder<RootRouters> = this.MenuRepository.createQueryBuilder().select()
    if(MenuQuery.name){
      SelectQueryBuilder
                        .where("name LIKE :name")
                        .setParameter("name", `%${MenuQuery.name}%`);
    }
    if(MenuQuery.pid){
      SelectQueryBuilder
                        .andWhere("pid = :pid")
                        .setParameter("pid", MenuQuery.pid);
    } else {
      SelectQueryBuilder
                        .andWhere("pid IS NULL")
    }
    return await SelectQueryBuilder
                                   .orderBy(MenuQuery.prop, Order)
                                   .skip(MenuQuery.limit * (MenuQuery.offset - 1))
                                   .take(MenuQuery.limit)
                                   .getMany();
  }

  //通过id 删除 菜单
  public async DeleteMenuById(id: number) {
    //创建事务
    const queryRunner = this.DataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      //先删除 pid = id 的 子菜单
      await this.MenuRepository
                .createQueryBuilder(null, queryRunner)
                .delete()
                .where("pid = :id")
                .setParameter("id", id)
                .execute();

      const DeleteResult = await this.MenuRepository
                                     .createQueryBuilder(null, queryRunner)
                                     .delete()
                                     .where("id = :id")
                                     .setParameter("id", id)
                                     .execute();
      //提交事务
      await queryRunner.commitTransaction();
      return DeleteResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  //根据id修改菜单
  public async UpdateMenuById(MenuUpdate: MenuUpdateDTO) {
    return await this.MenuRepository
                     .createQueryBuilder()
                     .update()
                     .set({
                       name: MenuUpdate.data.name,
                       key: MenuUpdate.data.key,
                       pid: MenuUpdate.data.pid,
                       remark: MenuUpdate.data.remark
                     })
                     .where("id = :id")
                     .setParameter("id", MenuUpdate.id)
                     .execute();
  }

  public async Total() {
    return await this.MenuRepository
                     .createQueryBuilder()
                     .select()
                     .where("pid IS NULL")
                     .getCount();
  }

  public async MenuAll() : Promise<RootRouters[]> {
    return await this.MenuRepository
                                    .createQueryBuilder("menu")
                                    .select()
                                    // .where("pid IS NULL")
                                    .getMany();
  }
}