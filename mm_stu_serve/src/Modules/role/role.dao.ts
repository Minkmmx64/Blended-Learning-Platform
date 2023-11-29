import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../index.type";
import { RootRole } from "src/Entity/root_role.entity";
import { RoleCreateDTO, RoleQueryDTO, RoleUpdateDTO } from "./role.dto";
import { RootRouters } from "src/Entity/root_routers.entity";
import { ToOrder } from "src/common/common";

export class RoleDAO {

  constructor(protected DataSource : DataSource){};

  private RoleRepository = this.DataSource.getRepository(RootRole);

  public async RoleListsPagination(RoleQuery: PaginationQuery<RoleQueryDTO>):  Promise<RootRole[]> {
    
    const SelectQueryBuilder: SelectQueryBuilder<RootRole> = this.RoleRepository.createQueryBuilder().select();

    if(RoleQuery.name) {
      SelectQueryBuilder
                        .where("name = :name")
                        .setParameter("name", RoleQuery.name);
    }
  
    return await SelectQueryBuilder
                                   .orderBy(RoleQuery.prop, ToOrder(RoleQuery))
                                   .skip((RoleQuery.offset - 1) * RoleQuery.limit)
                                   .take(RoleQuery.limit)
                                   .getMany();
  }

  public async RoleUpdate(update: RoleUpdateDTO): Promise<UpdateResult> {

    await this.SetRoutersToRols(update.id, update.data.menus);

    return await this.RoleRepository
                     .createQueryBuilder()
                     .update()
                     .set({
                       name: update.data.name
                     })
                     .where("id = :id")
                     .setParameter("id", update.id)
                     .execute();
  }

  //给角色添加菜单
  public async SetRoutersToRols(RoleId: number, Menus: Array<number>): Promise<void> {
    const queryRunner = this.DataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // 先加载之前的菜单
      const data = await this.RoleRepository
                             .createQueryBuilder(null, queryRunner)
                             .relation(RootRole, "routers")
                             .of(RoleId)
                             .loadMany<RootRouters>();
      // 删除之前的菜单
      await this.RoleRepository
                .createQueryBuilder(null, queryRunner)
                .relation(RootRole, "routers")
                .of(RoleId)
                .remove(data);
      // 重新添加关系
      await this.RoleRepository
                .createQueryBuilder(null, queryRunner)
                .relation(RootRole, "routers")
                .of(RoleId)
                .add(Menus);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  public async RoleCreate(create: RoleCreateDTO): Promise<InsertResult> {
    const Role = await this.RoleRepository
                           .createQueryBuilder()
                           .insert()
                           .values({
                             name: create.name
                           }).execute();
    // 增加角色时添加菜单列表
    await this.SetRoutersToRols(Role.raw.insertId, create.menus);
    return Role;
  }

  public async RoleDelete(id: number): Promise<DeleteResult> {
    return await this.RoleRepository
                     .createQueryBuilder()
                     .delete()
                     .where("id = :id")
                     .setParameter("id", id)
                     .execute();
  }

  public async Total(): Promise<number> {
    return await this.RoleRepository
                     .createQueryBuilder()
                     .select()
                     .getCount();
  }
}