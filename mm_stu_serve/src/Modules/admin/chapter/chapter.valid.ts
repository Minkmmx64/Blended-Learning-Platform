import * as Joi from "joi";
import { ChapterCreateDTO, ChapterUpdateDTO } from "./chapter.dto"; 
import { NotAcceptableException } from "@nestjs/common";

export const ChapterCreateValid = Joi.object<ChapterCreateDTO>({
  name: Joi.string().required().error(new NotAcceptableException("章节名称不能为空")),
  cover: Joi.string().required().error(new NotAcceptableException("章节封面不能为空")),
  pid: Joi.number().error(new NotAcceptableException("pid字段异常")),
  course: Joi.number().required().error(new NotAcceptableException("课程id字段异常")),
  remark: Joi.string().allow()
})

export const ChapterUpdateValid = Joi.object<ChapterUpdateDTO>({
  id: Joi.number().required().error(new NotAcceptableException("id 异常")),
  data: ChapterCreateValid
})
