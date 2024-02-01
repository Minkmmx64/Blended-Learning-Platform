import { Module } from "@nestjs/common";
import { TeacherController } from "./teacher.controller";
import { TeacherService } from "./teacher.service";
import { ClassDAO } from "../class/class.dao";

@Module({
  providers: [ TeacherService , ClassDAO ],
  controllers: [ TeacherController ],
})
export class TeacherModule {

}
