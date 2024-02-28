import { Module } from "@nestjs/common";
import { IndexController } from "./index.controller";
import { IndexService } from "./index.service";
import { ChapterService } from "src/Modules/admin/chapter/chapter.service";
import { CourseService } from "src/Modules/admin/course/course.service";
import { ClassService } from "src/Modules/admin/class/class.service";
import { resourceService } from "src/Modules/admin/resource/resource.service";
import { SignDAO } from "src/Modules/admin/sign/sign.dao";
import { RedisService } from "src/Modules/redis/RedisService";

@Module({
  providers: [IndexService, ChapterService, CourseService, ClassService, resourceService, SignDAO, RedisService],
  controllers: [IndexController]
})
export class IndexModule {

}
