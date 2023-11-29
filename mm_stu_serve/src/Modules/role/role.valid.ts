import * as Joi from "joi";
import { RoleCreateDTO } from "./role.dto";
import { NotAcceptableException } from "@nestjs/common";

export const RoleCreateValid = Joi.object<RoleCreateDTO>({
  name: Joi.string().required().error(new NotAcceptableException("角色名字不能为空")),
  menus: Joi.array()  
});

export const RoleUpdateValid = Joi.object<RoleCreateDTO>({
  name: Joi.string().required().error(new NotAcceptableException("角色名字不能为空"))
});