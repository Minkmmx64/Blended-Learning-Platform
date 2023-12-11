import * as Joi from "joi";
import { TeacherCreateDTO, TeacherUpdateDTO } from "./teacher.dto"; 
import { NotAcceptableException } from "@nestjs/common";

export const TeacherCreateValid = Joi.object<TeacherCreateDTO>({
  remark: Joi.string().allow().error(new NotAcceptableException("备注异常")),
  name: Joi.string().required().allow().error(new NotAcceptableException("姓名异常")),
  profile: Joi.string().required().error(new NotAcceptableException("简介异常")),
  gender: Joi.required().valid("男", "女").error(new NotAcceptableException("性别异常")),
  age: Joi.number().required().allow().error(new NotAcceptableException("年龄异常")),
})

export const TeacherUpdateValid = Joi.object<TeacherUpdateDTO>({
  id: Joi.number().required().error(new NotAcceptableException("id不能为空")),
  data: TeacherCreateValid
})
