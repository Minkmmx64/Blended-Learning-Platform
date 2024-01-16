import * as Joi from "joi";
import { resourceCreateDTO, resourceUpdateDTO } from "./resource.dto"; 
import { NotAcceptableException } from "@nestjs/common";

export const resourceCreateValid = Joi.object<resourceCreateDTO>({
  remark: Joi.string(),
  name: Joi.string().required().error(new NotAcceptableException("name不能为空")),
  src: Joi.string(),
  cover: Joi.string().required().error(new NotAcceptableException("封面不能为空")),
  type: Joi.string(),
  chapter_id:  Joi.number().required().error(new NotAcceptableException("章节Id不能为空")),
})

export const resourceUpdateValid = Joi.object<resourceUpdateDTO>({
  id: Joi.number().required().error(new NotAcceptableException("角色id不能为空")),
  data: resourceCreateValid
})
