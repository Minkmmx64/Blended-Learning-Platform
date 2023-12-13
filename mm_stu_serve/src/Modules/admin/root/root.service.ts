import { RootInfoDTO, RootLoginDTO, RootLoginUserInfo, RootQueryDTO, RootRegistDTO, RootUpdateDTO } from "./root.dto";
import { RootUser } from "src/Entity/root_user.entity";
import { DataSource, InsertResult, UpdateResult } from "typeorm";
import { RootServiceDAO } from "./root.dao";
import { JWT, encryption } from "src/utils/crypto";
import { randomUUID } from "crypto";
import { Injectable } from "@nestjs/common";
import { ListMetaData, PaginationQuery, ServiceData } from "../../index.type";
import { RootRouters } from "src/Entity/root_routers.entity";
import { RoleService } from "../role/role.service";

@Injectable()
export class RootService {

  constructor(
    public DataSource: DataSource,
    private readonly RoleService: RoleService  
  ){}

  public RootServiceDAO = new RootServiceDAO(this.DataSource);

  public async RootRegist(root: RootRegistDTO) : ServiceData<InsertResult> {
    try {
      const user = await this.RootServiceDAO.findRootByName(root.username);
      if(user) throw "用户名重复";
      const phone = await this.RootServiceDAO.findRootByPhone(root.phone);
      if(phone) throw "手机号重复";
      const queryRunner = this.DataSource.createQueryRunner();
      try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const ok = await this.RootServiceDAO.RootUserRepository
                          .createQueryBuilder(null, queryRunner)
                          .insert()
                          .into(RootUser)
                          .values({
                            username: root.username,
                            password: encryption(root.password),
                            phone: root.phone,
                            role: {
                              id: 1
                            }
                          })
                          .execute();
        await queryRunner.commitTransaction();
        return [ null, ok ];
      } catch (error) {
        queryRunner.rollbackTransaction();
        return [ new Error(error) , null];
      }
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async RootLogin(body : RootLoginDTO) : ServiceData<RootLoginUserInfo> {
    try {
      const user = await this.RootServiceDAO.findRootByName(body.username);
      if(user === null) throw "用户不存在";
      const verify = encryption(body.password);
      if(verify !== user.password) throw "密码错误";
      const token = JWT.genToken({
        uuid: randomUUID(),
        skey: JWT.secret,
        role: user.role.id
      });
      return [
        null, {
          token : token,
          user : {
            username: user.username,
            avatar: user.avatar,
            label: user.label,
            role: user.role
          }
        }
    ];
    } catch (error) {
      return [ new Error(error) , null ];
    }
  }

  public async RootUpdateInfo(user: RootInfoDTO): ServiceData<RootUser> {
    const { username: OldName, rusername: NewName } = user;
    try {
      if(NewName !== OldName) {   //如果新旧名字不一样则先判断用户名是否重复，再更新
        if(await this.RootServiceDAO.findRootByName(NewName))
          throw "用户名重复";
      }
      //找到用户更新
      const update = await this.RootServiceDAO.updateRootInfo(user);
      return [ null, update ];
    } catch (error) { return [ new Error(error), null ]; }
  }

  public async RootListsPagination(RootQuery: PaginationQuery<RootQueryDTO>) : ServiceData<ListMetaData<RootUser[]>> {
    try {
      const Roles = await this.RootServiceDAO.RootListsPagination(RootQuery);
      const res: ListMetaData<RootUser[]> = {
        list: Roles,
        meta: {
          total: await this.RootServiceDAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [ new Error(error), null ];
    }
  }

  public async RootUserRoleUpdate(RootUpdate: RootUpdateDTO) : ServiceData<UpdateResult> {
    try {
      const UpdateResult = await this.RootServiceDAO.RootUserRoleUpdate(RootUpdate);
      return [ null , UpdateResult];
    } catch (error) {
      return [ new Error(error), null ];
    }
  }
  
  public async AuthMenuList(role_id: number) : ServiceData<RootRouters[]> {
    try {
      const Auths = await this.RoleService.RoleDAO.getAuthRoutersByRoleId(role_id);
      return [ null, Auths ]
    } catch (error) {
      return [ new Error(error), null ];
    }
  }
}