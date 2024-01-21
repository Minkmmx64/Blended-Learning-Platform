import SocketIO, { Socket } from "socket.io-client";

export interface SocketConnectData {

}

export class SocketManager {

  private baseUrl = "ws://192.168.0.106:8082";

  public SocketInstance: Socket;

  constructor( data: SocketConnectData = {}) {

    this.SocketInstance = SocketIO(`${this.baseUrl}?${JSON.stringify(data)}`);
    
  }
}