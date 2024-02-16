export enum Sign {
  Gestures = "手势签到",
  QRcode = "二维码签到",
  Online = "在线签到"
}

export interface ISignOptions {
  signType: Sign;
  SignDuration: number;
  SignTitle: string;
  SignCipher: string;
}
