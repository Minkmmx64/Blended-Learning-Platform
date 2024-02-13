import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketConnectData } from './webSocket.type';
import { Injectable } from '@nestjs/common';
import { StuDAO } from '../admin/stu/stu.dao';
import { TeacherDAO } from '../admin/teacher/teacher.dao';

@Injectable()
@WebSocketGateway(8082, { cors: { origin: "*" } })
export class WebSocket implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly TeacherDAO: TeacherDAO,
    private readonly StuDAO: StuDAO
  ){}

  // 初始化服务
  afterInit(server: Server) {
    
  }

  //连接ws服务器
  handleConnection(client: Socket) {
    
    const data = JSON.parse(client.handshake.query.data as string) as SocketConnectData;
    console.log(client.id, data);
    if(data.type === "teacher") {
      // 该教师上线，将该教师加入到对应授课的班级房间
    } else {
      // 学生上线， 加入到该班级
      
    }
  }

  //客户端断开连接
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  //订阅消息
  @SubscribeMessage('login')
  handleMessage(client: Socket , payload: unknown): string {
    // 处理收到的消息
    console.log(client, payload);
       
    return 'Message received!';
  }
}
