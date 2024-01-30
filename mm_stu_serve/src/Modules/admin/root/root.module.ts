import { Module } from "@nestjs/common";
import { RootService } from "./root.service";
import { RootController } from "./root.controller";
import { RoleService } from "../role/role.service";
import { TeacherService } from "../teacher/teacher.service";

@Module({
    controllers:[RootController],
    providers:[RootService, RoleService, TeacherService],
    imports: []
})

export class RootModule {}