import * as Joi from "joi";
import { ExamCreateDTO, ExamUpdateDTO } from "./exam.dto"; 
import { NotAcceptableException } from "@nestjs/common";

export const ExamCreateValid = Joi.object<ExamCreateDTO>({
  time: Joi.string().allow().error(new NotAcceptableException("结束时间异常")),
  name: Joi.string().required().error(new NotAcceptableException("测验名称异常")),
  paperId: Joi.number().required().error(new NotAcceptableException("试卷Id异常")),
  courseId: Joi.number().required().error(new NotAcceptableException("课程Id异常")),
  classId: Joi.number().required().error(new NotAcceptableException("班级Id异常")),
  teacherId: Joi.number().required().error(new NotAcceptableException("教师Id异常")),
})

export const ExamUpdateValid = Joi.object<ExamUpdateDTO>({

})
