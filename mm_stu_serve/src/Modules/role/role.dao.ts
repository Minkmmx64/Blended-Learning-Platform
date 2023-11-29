import { DataSource, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { MenuQueryDTO } from "../menu/menu.dto";
import { PaginationQuery } from "../index.type";
import { RootRole } from "src/Entity/root_role.entity";
import { RoleCreateDTO, RoleUpdateDTO } from "./role.dto";
import { RootRouters } from "src/Entity/root_routers.entity";

export class RoleDAO {

  constructor(protected DataSource : DataSource){};

  private RoleRepository = this.DataSource.getRepository(RootRole);

  public async RoleListsPagination(RoleQuery: PaginationQuery<MenuQueryDTO>):  Promise<RootRole[]> {
    return [];
  }

  public async RoleUpdate(update: RoleUpdateDTO): Promise<UpdateResult> {
    return ;
  }

  public async SetRoutersToRols(RoleId: number, Menus: Array<number>): Promise<void> {
    const queryRunner = this.DataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // 先加载之前的菜单
      const data = await this.RoleRepository
                             .createQueryBuilder(null, queryRunner)
                             .relation(RootRole, "routers")
                             .of(1)
                             .loadMany<RootRouters>();
      // 删除之前的菜单
      await this.RoleRepository
                .createQueryBuilder(null, queryRunner)
                .relation(RootRole, "routers")
                .of(1)
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