
import * as Joi from "joi";
import { ClassifyCreateDTO, ClassifyUpdateDTO } from "./classify.dto"; 

export const ClassifyCreateValid = Joi.object<ClassifyCreateDTO>({
  name: Joi.string().required(),
  remark: Joi.allow(),
  avatar: Joi.string().allow()
})

export const ClassifyUpdateValid = Joi.object<ClassifyUpdateDTO>({
  id: Joi.number().required(),
  data: ClassifyCreateValid
})
