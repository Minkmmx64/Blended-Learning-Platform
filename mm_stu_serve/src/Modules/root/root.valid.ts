import * as Joi from "joi";
import { RootInfoDTO, RootLoginDTO, RootRegistDTO } from "./root.dto";
import { Rules } from "src/utils/regex";
import { NotAcceptableException } from "@nestjs/common";

//表单验证
export const RootRegistSchema = Joi.object<RootRegistDTO>({
  username : Joi.string().required().regex(Rules.username.rule).error(new NotAcceptableException(Rules.username.msg)),
  password : Joi.string().required().regex(Rules.password.rule).error(new NotAcceptableException(Rules.password.msg)),
  phone : Joi.string().required().regex(Rules.phone.rule).error(new NotAcceptableException(Rules.phone.msg)),
  bpassword : Joi.string().equal(Joi.ref("password")).error(new NotAcceptableException("两次密码不一致"))
})


//登录验证
export const RootLoginSchema = Joi.object<RootLoginDTO>({
  username: Joi.string().required().error(new NotAcceptableException("用户名不能为空")),
  password : Joi.string().required().error(new NotAcceptableException("密码不能为空")),
})

//修改信息验证

export const RootInfoSchema = Joi.object<RootInfoDTO>({
  rusername : Joi.string().required().regex(Rules.username.rule).error(new NotAcceptableException(Rules.username.msg)),
  avatar: Joi.alternatives().try(
    Joi.string().valid(null,""),
    Joi.string().required().regex(Rules.img.rule).error(new NotAcceptableException(Rules.img.msg))
  ),
  label: Joi.allow(),
  username: Joi.string().required().regex(Rules.username.rule).error(new NotAcceptableException("用户名不能为空")),
})