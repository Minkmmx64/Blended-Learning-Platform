import * as Joi from "joi";
import { SmsDTO, vTokenDTO } from "./common.dto";
import { NotAcceptableException } from "@nestjs/common";

//表单验证
export const CommonSmsValid = Joi.object<SmsDTO>({
  code: Joi.string().required().error(new NotAcceptableException("验证码不能为空"))
})

export const CommonTokenValid = Joi.object<vTokenDTO>({
  token: Joi.string().required().error(new NotAcceptableException("用户无效"))
})