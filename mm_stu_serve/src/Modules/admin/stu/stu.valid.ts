import * as Joi from "joi";
import { StuCreateDTO, StuUpdateDTO } from "./stu.dto"; 
import { NotAcceptableException } from "@nestjs/common";

export const StuCreateValid = Joi.object<StuCreateDTO>({
  remark: Joi.string().allow().error(new NotAcceptableException("标签异常")),
  // student: Joi.string().required().allow().error(new NotAcceptableException("学号异常")),
  // school: Joi.string().required().allow().error(new NotAcceptableException("学校异常")),
  name: Joi.string().required().allow().error(new NotAcceptableException("姓名异常")),
  native: Joi.string().required().allow().error(new NotAcceptableException("籍贯异常")),
  year: Joi.number().required().allow().error(new NotAcceptableException("入学年份异常")),
  gender: Joi.required().valid("男", "女").error(new NotAcceptableException("性别异常")),
  age: Joi.number().required().allow().error(new NotAcceptableException("年龄异常")),
  class_id: Joi.number().required().allow().error(new NotAcceptableException("班级异常")),
  avatar: Joi.string().required().allow().error(new NotAcceptableException("照片异常")),
});

export const StuUpdateValid = Joi.object<StuUpdateDTO>({
  id: Joi.number().required().error(new NotAcceptableException("id不能为空")),
  data: StuCreateValid
});
