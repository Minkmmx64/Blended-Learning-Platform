import * as Joi from "joi";
import { CollegeUpdateDTO, StuCollegeCreateDTO } from "./college.dto";
import { NotAcceptableException } from "@nestjs/common";


//表单验证
export const StuCollegeCreateValid = Joi.object<StuCollegeCreateDTO>({
  name : Joi.string().required().error(new NotAcceptableException("学院名称不能为空")),
  remark: Joi.string(),
})


export const MenuUpdateValid = Joi.object<CollegeUpdateDTO>({
  id: Joi.number().required().error(new NotAcceptableException("id 异常")),
  data: StuCollegeCreateValid
})