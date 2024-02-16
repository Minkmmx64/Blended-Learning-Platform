import * as Joi from "joi";
import { Sign, SignCreateDTO, SignUpdateDTO } from "./sign.dto"; 
import { NotAcceptableException } from "@nestjs/common";

export const SignCreateValid = Joi.object<SignCreateDTO>({
  signType: Joi.required().allow(Sign.Gestures, Sign.Online, Sign.QRcode).error(new NotAcceptableException("签到类型异常")),
  SignDuration: Joi.number().greater(0).less(61).error(new NotAcceptableException("签到时长应大于0小于等于60")),
  SignTitle: Joi.string().required().error(new NotAcceptableException("签到标题为空")),
  SignCipher: Joi.any(),
  classId: Joi.number(),
  courseId: Joi.number(),
  teacherId: Joi.number(),
});

export const SignUpdateValid = Joi.object<SignUpdateDTO>({
  id: Joi.number().required(),
  data: SignCreateValid
})
