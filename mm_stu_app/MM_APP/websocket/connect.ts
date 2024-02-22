import SocketIO, { Socket } from "socket.io-client";

export interface SocketConnectData {
  type: "student" | "teacher";
  id: number;
  devices_id: string | null;
}

export class SocketManager {

  private baseUrl = "ws://192.168.0.105:8082";

  public SocketInstance: Socket;

  constructor( data: SocketConnectData) {

    this.SocketInstance = SocketIO(`${this.baseUrl}?data=${JSON.stringify(data)}`);
    
  }
}

