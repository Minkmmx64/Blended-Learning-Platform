import { Module } from "@nestjs/common";
import { AppExamService } from "./exam.service";
import { AppExamController } from "./exam.controller";
import { ExamDAO } from "src/Modules/admin/exam/exam.dao";
import { PaperDAO } from "src/Modules/admin/paper/paper.dao";

@Module({
  providers: [ AppExamService, ExamDAO, PaperDAO ],
  controllers: [ AppExamController ]
})
export class AppExamModule {

}