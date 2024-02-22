import { SignCreate } from "@/Request/ApiModules/sign";
import { Socket, io } from "socket.io-client";

//socket 事件
export interface EmitEvent {
  SEND_SIGN: SignCreate & { SignId: number }
}


export interface SocketConnectData {
  type: "student" | "teacher" | "root";
  id: number;
}

export class SocketManager {

  private baseUrl = "ws://app.minkm.api:8082";

  public SocketInstance: Socket;

  constructor( data: SocketConnectData) {
    
    this.SocketInstance = io(`${this.baseUrl}?data=${JSON.stringify(data)}`, {
      retries: 10,
      ackTimeout: 1000
    });

  }


  public on<T extends keyof EmitEvent>(event: T, cb: (data: EmitEvent[T]) => void) {
    this.SocketInstance.on(event, cb as any)
  }

  public emit<T extends keyof EmitEvent>(event: T, data: EmitEvent[T]) {
    this.SocketInstance.emit(event, data);
  }
}