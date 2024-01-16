import { Module } from "@nestjs/common";
import { AppUSerController } from "./user.controller";
import { AppUserService } from "./user.service";
import { TeacherService } from "src/Modules/admin/teacher/teacher.service";
import { TeacherDAO } from "src/Modules/admin/teacher/teacher.dao";
import { StuDAO } from "src/Modules/admin/stu/stu.dao";

@Module({
  controllers: [ AppUSerController ] ,
  providers: [ AppUserService, TeacherDAO, StuDAO ]
})
export class AppUserModule {
  
}