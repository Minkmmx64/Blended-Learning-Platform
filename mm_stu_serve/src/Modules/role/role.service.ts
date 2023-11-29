import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { RoleCreateDTO, RoleQueryDTO, RoleUpdateDTO } from "./role.dto";
import { ListMetaData, PaginationQuery, ServiceData } from "../index.type";
import { RootRole } from "src/Entity/root_role.entity";
import { RoleDAO } from "./role.dao";

@Injectable()
export class RoleService {

    constructor(private readonly DataSource: DataSource){}

    public RoleDAO = new RoleDAO(this.DataSource);

    public async RoleListsPagination(query: PaginationQuery<RoleQueryDTO>): ServiceData<ListMetaData<RootRole[]>>{
        try {
            const Roles = await this.RoleDAO.RoleListsPagination(query);
            const res: ListMetaData<RootRole[]> = {
                list: Roles,
                meta: {
                  total: await this.RoleDAO.Total()
                }
            }
            return [ null, res ];
        } catch (error) {
            return [ new Error(error), null ];
        }
    }

    public async RoleUpdate(update: RoleUpdateDTO) : ServiceData<UpdateResult> {
        try {
            return null;
        } catch (error) {
            
        }
    }

    public async RoleCreate(create: RoleCreateDTO) : ServiceData<InsertResult> {
        try {
            return null;
        } catch (error) {
            
        }
    }

    public async RoleDelete(id: number) :ServiceData<DeleteResult> {
        try {
            return null;
        } catch (error) {
            
        }
    }
}