import { SignCreate } from "@/Request/ApiModules/sign";
import { Socket, io } from "socket.io-client";
import {IExam} from "@/Request/ApiModules/exam";

//socket emit事件
export interface EmitEvent {
  SEND_SIGN: SignCreate & { SignId: number }
  TEST: null;
  SEND_EXAM: IExam;
}

//socket on事件
export interface OnEvent {
  // 用户签到
  RECV_SIGN: { id: number }
  APP_STUDENT_SIGN: {
    signId: number;
    studentId: number;
  }
}


export interface SocketConnectData {
  type: "student" | "teacher" | "root";
  id: number;
}

export class SocketManager {

  private baseUrl = "ws://app.minkm.api:8082";

  private SocketInstance: Socket;

  constructor( data: SocketConnectData) {
    
    this.SocketInstance = io(`${this.baseUrl}?data=${JSON.stringify(data)}`, {});

  }


  public on<T extends keyof OnEvent>(event: T, cb: (data: OnEvent[T]) => void) {
    this.SocketInstance.on(event, cb as any)
  }

  public emit<T extends keyof EmitEvent>(event: T, data: EmitEvent[T]) {
    this.SocketInstance.emit(event, data);
  }

  public io(){
    return this.SocketInstance;
  }
}