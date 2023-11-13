import { RootInfoDTO, RootLoginDTO, RootRegistDTO } from "./root.dto";
import { RootUser } from "src/Entity/root_user.entity";
import { DataSource, InsertResult } from "typeorm";
import { RootServiceDAO } from "./root.dao";
import { JWT, encryption } from "src/utils/crypto";
import { randomUUID } from "crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RootService {

  constructor(public DataSource: DataSource){}

  public RootServiceDAO = new RootServiceDAO(this.DataSource);

  public async RootRegist(root: RootRegistDTO) : Promise<[any, InsertResult | null]> {
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
        return [ error, null];
      }
    } catch (error) {
      return [ error, null];
    }
  }

  public async RootLogin(body : RootLoginDTO) : Promise<[any, any]> {
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
      return [ error , null ];
    }
  }

  public async RootUpdateInfo(user: RootInfoDTO): Promise<[any, any]> {
    const { username: OldName, rusername: NewName } = user;
    try {
      if(NewName !== OldName) {   //如果新旧名字不一样则先判断用户名是否重复，再更新
        if(await this.RootServiceDAO.findRootByName(NewName))
          throw "用户名重复";
      }
      //找到用户更新
      const update = await this.RootServiceDAO.updateRootInfo(user);
      return [ null, update ];
    } catch (error) { return [ error, null ]; }
  }
}