import { Module } from '@nestjs/common';
import { WebSocket } from './websocket.controller';
import { TeacherDAO } from '../admin/teacher/teacher.dao';
import { StuDAO } from '../admin/stu/stu.dao';


@Module({
  providers: [ WebSocket, TeacherDAO, StuDAO ],
})
export class WebSocketModule {}
