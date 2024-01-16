import * as Joi from "joi";
import { LoginData, RegisterData } from "./user.dto";
import { NotAcceptableException } from "@nestjs/common";
import { Rules } from "src/utils/regex";

export const RegisterDataValid = Joi.object<RegisterData>({
  username: Joi.string().required().regex(Rules.username.rule).error(new NotAcceptableException("用户名错误")),
  password: Joi.string().required().regex(Rules.username.rule).error(new NotAcceptableException("密码格式错误")),
  phone: Joi.string().required().regex(Rules.phone.rule).error(new NotAcceptableException("手机号不正确")),
  type: Joi.string().required().valid("student", "teacher").error(new NotAcceptableException("身份不正确")),
  student_code: Joi.allow(),
  teacher_code: Joi.allow(),
})

export const LoginDataValid = Joi.object<LoginData>({
  username: Joi.string().required().error(new NotAcceptableException("用户名不能为空")),
  password: Joi.allow(),
})