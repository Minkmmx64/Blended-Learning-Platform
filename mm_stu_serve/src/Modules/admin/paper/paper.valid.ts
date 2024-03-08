import * as Joi from "joi";
import { PaperCreateDTO, PaperUpdateDTO } from "./paper.dto"; 
import { NotAcceptableException } from "@nestjs/common";

export const PaperCreateValid = Joi.object<PaperCreateDTO>({
  remark: Joi.string(),
  name: Joi.string().required().error(new NotAcceptableException("试卷名字不能为空")),
  total: Joi.number().error(new NotAcceptableException("总分不能为空")),
  classify: Joi.string().required().error(new NotAcceptableException("试卷分类不能为空")),
  teacher_id: Joi.number().required().error(new NotAcceptableException("发布教师不能为空"))
})

export const PaperUpdateValid = Joi.object<PaperUpdateDTO>({
  id: Joi.number().required().error(new NotAcceptableException("试卷id不能为空")),
  data: PaperCreateValid
})
