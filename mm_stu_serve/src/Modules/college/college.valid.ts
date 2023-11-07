import * as Joi from "joi";
import { StuCollegeCreateDTO } from "./college.dto";
import { NotAcceptableException } from "@nestjs/common";


//表单验证
export const StuCollegeCreateSchema = Joi.object<StuCollegeCreateDTO>({
  name : Joi.string().required().error(new NotAcceptableException("学院名称不能为空")),
})
