import * as Joi from "joi";
import { RoleCreateDTO, RoleUpdateDTO } from "./role.dto";
import { NotAcceptableException } from "@nestjs/common";

export const RoleCreateValid = Joi.object<RoleCreateDTO>({
  name: Joi.string().required().error(new NotAcceptableException("角色名字不能为空")),
  menus: Joi.array(),
  remark: Joi.string()
});

export const RoleUpdateValid = Joi.object<RoleUpdateDTO>({
  id: Joi.number().required().error(new NotAcceptableException("角色id不能为空")),
  data: RoleCreateValid
});

