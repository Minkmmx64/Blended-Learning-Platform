import * as Joi from "joi";
import { RootRegistDTO } from "./root.dto";
import { Rules } from "src/utils/regex";
import { NotAcceptableException } from "@nestjs/common";

//表单验证
export const RootRegistSchema = Joi.object<RootRegistDTO>({
  username : Joi.string().required().regex(Rules.username.rule).error(new NotAcceptableException(Rules.username.msg)),
  password : Joi.string().required().regex(Rules.password.rule).error(new NotAcceptableException(Rules.password.msg)),
  phone : Joi.string().required().regex(Rules.phone.rule).error(new NotAcceptableException(Rules.phone.msg)),
  bpassword : Joi.string().equal(Joi.ref("password")).error(new NotAcceptableException("两次密码不一致"))
})