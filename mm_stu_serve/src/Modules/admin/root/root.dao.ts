import { RootUser } from "src/Entity/root_user.entity";
import { DataSource, SelectQueryBuilder, UpdateResult } from "typeorm";
import { RootInfoDTO, RootQueryDTO, RootUpdateDTO } from "./root.dto";
import { PaginationQuery } from "../../index.type";
import { ToOrder } from "src/common/common";

export class RootServiceDAO {

  constructor(protected DataSource : DataSource){};
  
  public RootUserRepository = this.DataSource.getRepository(RootUser);

  public async findRootByName(username: string): Promise<RootUser> {
    try {
      return  await this.RootUserRepository.findOne({
        where: { username: username },
        relations : { "role": true }
      });
    } catch (error) { return error; }
  }

  public async findRootByPhone(phone: string): Promise<RootUser> {
    return await this.RootUserRepository.findOne({where: { phone: phone }});
  }

  public async updateRootInfo(RootInfo: RootInfoDTO) {
    const User = await this.findRootByName(RootInfo.username);
    if(User === null) throw "用户不存在";
    User.username = RootInfo.rusername;
    User.avatar = RootInfo.avatar ?? User.avatar;
    User.label = RootInfo.label ?? User.label
    return await this.RootUserRepository.save(User);
  }

  public async RootListsPagination(RoleQuery: PaginationQuery<RootQueryDTO>):  Promise<RootUser[]> {

    const SelectQueryBuilder: SelectQueryBuilder<RootUser> = this.RootUserRepository.createQueryBuilder("root").leftJoinAndSelect("root.role", "mm_stu_root_role");

    if(RoleQuery.prop) {
      SelectQueryBuilder
                        .orderBy("root." + RoleQuery.prop, ToOrder(RoleQuery))
    }

    return await SelectQueryBuilder
                                   .skip((RoleQuery.offset - 1) * RoleQuery.limit)
                                   .take(RoleQuery.limit)
                                   .getMany();
  }

  public async Total(): Promise<number> {
    return await this.RootUserRepository
                     .createQueryBuilder()
                     .select()
                     .getCount();
  }

  public async RootUserRoleUpdate(RootUpdate: RootUpdateDTO) {
    const UpdateResult = await this.RootUserRepository
                                                      .createQueryBuilder()
                                                      .update()
                                                      .set({
                                                        role: {
                                                          id: RootUpdate.data.role
                                                        }
                                                      })
                                                      .where("id = :id")
                                                      .setParameter("id", RootUpdate.id)
                                                      .execute();
    return UpdateResult;
  }

  public async findRootUserById(userId: number) : Promise<RootUser> {
    return await this.RootUserRepository
                     .createQueryBuilder("user")
                     .leftJoinAndSelect("user.role", "role")
                     .where("user.id = :userId")
                     .setParameter("userId", userId)
                     .getOne();
  }

  public async updateRootUserById(userId: number, user: RootUser) : Promise<UpdateResult> {
    return await this.RootUserRepository
                     .createQueryBuilder()
                     .update()
                     .set(user)
                     .where("id = :userId")
                     .setParameter("userId", userId)
                     .execute();
  }

}