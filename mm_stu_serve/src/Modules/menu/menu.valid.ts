import * as Joi from "joi";
import { MenuCreateDTO } from "./menu.dto";
import { NotAcceptableException } from "@nestjs/common";

export const MenuCreateValid = Joi.object<MenuCreateDTO>({
  name: Joi.string().required().error(new NotAcceptableException("菜单名字不能为空")),
  key: Joi.string().required().error(new NotAcceptableException("菜单关键字不能为空")),
  pid: Joi.number().error(new NotAcceptableException("pid字段异常"))
});