import { DataSource } from "typeorm";
import { MenuQueryDTO } from "../menu/menu.dto";
import { PaginationQuery } from "../index.type";
import { RootRole } from "src/Entity/root_role.entity";
import { RoleCreateDTO, RoleUpdateDTO } from "./role.dto";


export class RoleDAO {
    constructor(protected DataSource : DataSource){};

    public async RoleListsPagination(RoleQuery: PaginationQuery<MenuQueryDTO>):  Promise<RootRole[]> {

        return [];
    }

    public async RoleUpdate(update: RoleUpdateDTO) {

    }

    public async RoleCreate(create: RoleCreateDTO) {

    }

    public async RoleDelete(id: number) {
        
    }

    public async Total() {

        return 0;
    }
}