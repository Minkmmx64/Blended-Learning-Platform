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