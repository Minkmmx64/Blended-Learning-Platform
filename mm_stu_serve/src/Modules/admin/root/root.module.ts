import { Module } from "@nestjs/common";
import { RootService } from "./root.service";
import { RootController } from "./root.controller";
import { RoleService } from "../role/role.service";

@Module({
    controllers:[RootController],
    providers:[RootService, RoleService],
    imports: []
})

export class RootModule {}