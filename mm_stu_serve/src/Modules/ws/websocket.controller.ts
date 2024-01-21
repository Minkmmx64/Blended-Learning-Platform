import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8082)
export class WebSocket implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket initialized', server);
  }

  //连接ws服务器
  handleConnection(client: Socket) {
    
  }

  //客户端断开连接
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  //订阅消息
  @SubscribeMessage('test')
  handleMessage(client: Socket , payload: unknown): string {
    // 处理收到的消息
    console.log(client, payload);
    
    return 'Message received!';
  }
}
