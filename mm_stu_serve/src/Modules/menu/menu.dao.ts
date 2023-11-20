import { DataSource } from "typeorm";
import { MenuCreateDTO } from "./menu.dto";
import { RootRouters } from "src/Entity/root_routers.entity";


export class MenuDAO {
  constructor(protected DataSource : DataSource){};

  public MenuRepository = this.DataSource.getRepository(RootRouters);

  public async MenuCteate(MenuCreate : MenuCreateDTO) {
    return await this.MenuRepository.insert({
      name: MenuCreate.name,
      key: MenuCreate.key,
      pid: MenuCreate.pid ?? null
    });
  }
  
}