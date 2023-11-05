import { Injectable } from "@nestjs/common";
import { RootUser } from "src/Entity/root_user.entity";
import { DataSource } from "typeorm";

@Injectable()
export class RootServiceDAO {

  protected RootUserRepository = this.DataSource.getRepository(RootUser);

  constructor(protected DataSource : DataSource){};

  protected async findRootByName(username: string): Promise<RootUser> {
    try {
      const user = await this.RootUserRepository.findOne({
        where: {
          username: username
        },
        relations : {
          "role": true
        }
      });
      return user;
    } catch (error) {
      return error;
    }
  }

  protected async findRootByPhone(phone: string): Promise<RootUser> {
    return await this.RootUserRepository.findOne({where: {
      phone: phone
    }});
  }

}