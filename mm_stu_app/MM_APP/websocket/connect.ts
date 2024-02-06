import SocketIO, { Socket } from "socket.io-client";

export interface SocketConnectData {
  type: "student" | "teacher";
  id: number;
}

export class SocketManager {

  private baseUrl = "ws://app.minkm.api:8082";

  public SocketInstance: Socket;

  constructor( data: SocketConnectData) {

    this.SocketInstance = SocketIO(`${this.baseUrl}?data=${JSON.stringify(data)}`);
    
  }
}

