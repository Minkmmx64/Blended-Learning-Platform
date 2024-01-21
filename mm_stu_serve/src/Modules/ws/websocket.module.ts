import { Module } from '@nestjs/common';
import { WebSocket } from './websocket.controller';


@Module({
  providers: [ WebSocket ],
})
export class WebSocketModule {}
