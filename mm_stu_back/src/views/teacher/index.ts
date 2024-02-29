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

// 本系统二维码基本数据结构
export interface EventType {
  QRSign: {

  }
  QRLogin: {

  }
}

export interface QRCodeProps<K extends keyof EventType> {
  event: `MM:${K}`;
  data: EventType[K]
}