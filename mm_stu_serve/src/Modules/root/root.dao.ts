import { Injectable } from "@nestjs/common";
import { RootUser } from "src/Entity/root_user.entity";
import { DataSource } from "typeorm";


export class RootServiceDAO {

  constructor(protected DataSource : DataSource){};
  
  public RootUserRepository = this.DataSource.getRepository(RootUser);

  public async findRootByName(username: string): Promise<RootUser> {
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

  public async findRootByPhone(phone: string): Promise<RootUser> {
    return await this.RootUserRepository.findOne({where: {
      phone: phone
    }});
  }
}