import * as Joi from "joi";
import { SmsDTO } from "./common.dto";
import { NotAcceptableException } from "@nestjs/common";

//表单验证
export const CommonValid = Joi.object<SmsDTO>({
  code: Joi.string().required().error(new NotAcceptableException("验证码不能为空"))
})