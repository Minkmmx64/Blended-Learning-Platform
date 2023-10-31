import { Injectable } from "@nestjs/common";
import { RootUser } from "src/Entity/root_user.entity";
import { DataSource } from "typeorm";

@Injectable()
export class RootServiceDAO {

  protected RootUserRepository = this.DataSource.getRepository(RootUser);

  constructor(protected DataSource : DataSource){};

  protected async findRootByName(username: string): Promise<RootUser> {
    return await this.RootUserRepository.findOne({where: {
      username: username
    }});
  }

  protected async findRootByPhone(phone: string): Promise<RootUser> {
    return await this.RootUserRepository.findOne({where: {
      phone: phone
    }});
  }

}