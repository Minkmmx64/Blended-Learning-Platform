import * as Joi from "joi";
import { RegisterData } from "./user.dto";
import { NotAcceptableException } from "@nestjs/common";

export const RegisterDataValid = Joi.object<RegisterData>({
  username: Joi.string().required().error(new NotAcceptableException("用户名不能为空"))
})