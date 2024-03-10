import * as Joi from "joi";
import { SubjectCreateDTO, SubjectType, SubjectUpdateDTO } from "./subject.dto"; 
import { NotAcceptableException } from "@nestjs/common";

export const SubjectCreateValid = Joi.object<SubjectCreateDTO>({
  remark: Joi.string(),
  describe:  Joi.string().required().error(new NotAcceptableException("题目描述不能为空")),
  type: Joi.string().valid(SubjectType.Judge, SubjectType.Multiple, SubjectType.Profile, SubjectType.Signal).required().error(new NotAcceptableException("题目类型错误")),
  result:  Joi.string().required().error(new NotAcceptableException("参考答案不能为空")),
  classify:  Joi.string().required().error(new NotAcceptableException("题目分类不能为空")),
  options: Joi.array().error(new NotAcceptableException("题目选项是数组如果不是简答题和判断题")),
  points: Joi.number().error(new NotAcceptableException("分值类型错误")),
})

export const SubjectUpdateValid = Joi.object<SubjectUpdateDTO>({
  id: Joi.number().required().error(new NotAcceptableException("id不能为空")),
  data: SubjectCreateValid
})
