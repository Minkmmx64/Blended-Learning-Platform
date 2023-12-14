import * as Joi from "joi";
import { ShopCreateDTO, ShopUpdateDTO } from "./shop.dto"; 

export const ShopCreateValid = Joi.object<ShopCreateDTO>({
  name: Joi.string().allow(),
  remark: Joi.allow(),
  prices: Joi.number().allow(),
  stock: Joi.number().allow(),
  avatar: Joi.string().allow(),
  classify_id: Joi.number().required()
})

export const ShopUpdateValid = Joi.object<ShopUpdateDTO>({
  id: Joi.number().required(),
  data: ShopCreateValid
})
