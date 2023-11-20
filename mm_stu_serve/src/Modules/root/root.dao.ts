import { RootUser } from "src/Entity/root_user.entity";
import { DataSource } from "typeorm";
import { RootInfoDTO } from "./root.dto";

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
}