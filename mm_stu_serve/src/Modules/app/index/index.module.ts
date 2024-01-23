
import { Module } from "@nestjs/common";
import { IndexController } from "./index.controller";
import { IndexService } from "./index.service";
import { ChapterService } from "src/Modules/admin/chapter/chapter.service";
import { CourseService } from "src/Modules/admin/course/course.service";

@Module({
  providers: [IndexService, ChapterService, CourseService],
  controllers: [IndexController]
})
export class IndexModule {

}
