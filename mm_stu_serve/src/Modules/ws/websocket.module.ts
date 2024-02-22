import { Module } from '@nestjs/common';
import { WebSocket } from './websocket.controller';
import { TeacherDAO } from '../admin/teacher/teacher.dao';
import { StuDAO } from '../admin/stu/stu.dao';
import { RedisService } from '../redis/RedisService';
import { ClassDAO } from '../admin/class/class.dao';


@Module({
  providers: [ WebSocket, TeacherDAO, StuDAO, RedisService, ClassDAO ],
})
export class WebSocketModule {}
