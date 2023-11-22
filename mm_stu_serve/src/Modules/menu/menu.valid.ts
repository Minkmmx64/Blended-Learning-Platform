import * as Joi from "joi";
import { MenuCreateDTO, MenuUpdateDTO } from "./menu.dto";
import { NotAcceptableException } from "@nestjs/common";

export const MenuCreateValid = Joi.object<MenuCreateDTO>({
  name: Joi.string().required().error(new NotAcceptableException("菜单名字不能为空")),
  key: Joi.string().required().error(new NotAcceptableException("菜单关键字不能为空")),
  pid: Joi.number().error(new NotAcceptableException("pid字段异常"))
});

export const MenuUpdateValid = Joi.object<MenuUpdateDTO>({
  id: Joi.number().required().error(new NotAcceptableException("id 异常")),
  data: Joi.object<MenuCreateDTO>({
    name: Joi.string().required().error(new NotAcceptableException("菜单名字不能为空")),
    key: Joi.string().required().error(new NotAcceptableException("菜单关键字不能为空")),
    pid: Joi.number().error(new NotAcceptableException("pid 异常"))
  })
})