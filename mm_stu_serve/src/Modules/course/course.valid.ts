
import * as Joi from "joi";
import { CourseCreateDTO, CourseUpdateDTO } from "./course.dto"; 
import { NotAcceptableException } from "@nestjs/common";

export const CourseCreateValid = Joi.object<CourseCreateDTO>({
  remark: Joi.string().allow().error(new NotAcceptableException("备注异常")),
  name: Joi.string().required().error(new NotAcceptableException("课程名异常")),
  avatar: Joi.string().required().error(new NotAcceptableException("头像异常")),
});

export const CourseUpdateValid = Joi.object<CourseUpdateDTO>({
  id: Joi.number().required().error(new NotAcceptableException("课程id异常")),
  data: CourseCreateValid
});
