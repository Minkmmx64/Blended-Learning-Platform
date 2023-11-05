import { RootLoginDTO, RootRegistDTO } from "./root.dto";
import { RootUser } from "src/Entity/root_user.entity";
import { InsertResult } from "typeorm";
import { getDate } from "src/utils/date";
import { RootServiceDAO } from "./root.dao";
import { JWT, encryption } from "src/utils/crypto";
import { randomUUID } from "crypto";

export class RootService extends RootServiceDAO {
  public async RootRegist(root: RootRegistDTO) : Promise<[any, InsertResult | null]> {
    try {
      const user = await this.findRootByName(root.username);
      if(user) throw "用户名重复";
      const phone = await this.findRootByPhone(root.phone);
      if(phone) throw "手机号重复";
      const queryRunner = this.DataSource.createQueryRunner();
      try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const ok = await this.RootUserRepository
                          .createQueryBuilder(null, queryRunner)
                          .insert()
                          .into(RootUser)
                          .values({
                            username: root.username,
                            create_time: getDate(),
                            password: encryption(root.password),
                            update_time: getDate(),
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
      const user = await this.findRootByName(body.username);
      if(user === null) throw "用户不存在";
      const verify = encryption(body.password);
      if(verify !== user.password) throw "密码错误";
      const token = JWT.genToken({
        uuid: randomUUID(),
        skey: JWT.secret
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
}