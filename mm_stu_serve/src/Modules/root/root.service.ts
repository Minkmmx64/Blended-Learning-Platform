import { RootRegistDTO } from "./root.dto";
import { RootUser } from "src/Entity/root_user.entity";
import { InsertResult } from "typeorm";
import { getDate } from "src/utils/date";
import { RootServiceDAO } from "./root.dao";

export class RootService extends RootServiceDAO {
  
  public async RootRegist(root: RootRegistDTO) : Promise<[any, InsertResult | null]> {
    try {
      const user = await this.findRootByName(root.username);
      if(user) throw "用户名重复";
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
                            password: root.password,
                            update_time: getDate(),
                            phone: root.phone
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
}