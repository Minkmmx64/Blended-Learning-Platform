export enum Sign {
  Gestures = "手势签到",
  QRcode = "二维码签到",
  Online = "在线签到"
}

export class SignCreateDTO{
  signType: Sign;
  SignDuration: number;
  SignTitle: string;
  SignCipher: string;
  classId: number;
  courseId: number;
  teacherId: number;
}

export class SignQueryDTO {
  
}

export class SignUpdateDTO {
  id: number;
  data: SignCreateDTO;
}
