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
import { TeacherService } from "../teacher/teacher.service";

@Injectable()
export class RootService {

  constructor(
    public DataSource: DataSource,
    private readonly RoleService: RoleService,
    private readonly TeacherService: TeacherService,
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
                              id: 4
                            }
                          })
                          .execute();
        await queryRunner.commitTransaction();
        return [ null, ok ];
      } catch (error) {
        queryRunner.rollbackTransaction();
        return [ new Error(error) , null];
      } finally {
        queryRunner.release();
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
            role: user.role,
            id: user.id
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

  public async TeacherAuthorization(userId: number, code: string): ServiceData<boolean> {
    try {
      // 先查看当前管理员角色是否是教师
      const user = await this.RootServiceDAO.findRootUserById(userId);
      if(!user){
        throw "该用户不存在，数据错误";
      }
      const teacherRole = await this.RoleService.RoleDAO.getRoleByName("教师");
      if(!teacherRole){
        throw "暂无教师角色，请联系管理员添加";
      }
      if(user.role.id === teacherRole.id) throw "该角色已经认证，请联系管理员";  
      //不是教师可以进行认证
      const teacherUser = await this.TeacherService.TeacherDAO.getTeacherByCode(code);
      if(!teacherUser) {
        throw "暂无该教师，请检查教师编号是否有误";
      }
      //查看该教师是否已经被认证
      if(teacherUser.authentication === "已认证"){
        throw "该教师已经被认证"
      }
      // 修改教师状态为已经认证
      await this.TeacherService.TeacherDAO.UpdateTeacherById({
        id: teacherUser.id,
        data: {
          ...teacherUser,
          authentication: "已认证"
        }
      });
      // 为管理员添加教师id, 同时修改角色为教师
      await this.RootServiceDAO.updateRootUserById(userId, {
        ...user,
        teacher: teacherUser,
        role: teacherRole
      });
      return [ null, true ];
    } catch (error) {
      return [ new Error(error), null ];
    }
  }
}