import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MapProps, SignCreate, SocketConnectData } from './webSocket.type';
import { Injectable } from '@nestjs/common';
import { StuDAO } from '../admin/stu/stu.dao';
import { TeacherDAO } from '../admin/teacher/teacher.dao';
import { RedisService } from '../redis/RedisService';
import { broadCast } from 'src/utils/JPush';
import { ClassCourseTeacher } from 'src/Entity/teacher_course_class.entity';
import { ClassDAO } from '../admin/class/class.dao';

@Injectable()
@WebSocketGateway(8082, { cors: { origin: "*" } })
export class WebSocket implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly TeacherDAO: TeacherDAO,
    private readonly StuDAO: StuDAO,
    private readonly RedisService: RedisService,
    private readonly ClassDAO: ClassDAO
  ){}

  private getClassRoom = (classId: number) => `class:${classId}`;

  private DeviceLists = new Map<string, MapProps[]>();

  // 初始化服务
  afterInit(server: Server) {
    
  }

  //连接ws服务器
  async handleConnection(client: Socket) {
    
    const data = JSON.parse(client.handshake.query.data as string) as SocketConnectData;
    if(data.type === "teacher") {
      // 该教师上线，将该教师加入到对应授课的班级房间
      // 获取教师所有课表
     const cls = await this.ClassDAO.getTeacherClassGroup(data.id);
     const ids = cls.map( group => group.class.id)
     ids.forEach( id => client.to(this.getClassRoom(id)));
    } else {

      if(data.devices_id) {

        const stu = await this.StuDAO.getStudentById(data.id)
        const classId = stu.class.id;

        //将该学校添加到同一个班级
        client.join(this.getClassRoom(classId));

        console.log(`学生:${stu.name} 加入到 班级群 ${stu.class.id} = ${stu.class.name}`);
        
        //添加一条设备信息到该班级
        const mapProps = this.DeviceLists.get(this.getClassRoom(classId));

        const Props : MapProps = {
          devices: data.devices_id
        }
        if(mapProps && mapProps.length > 0) {
          this.DeviceLists.set(
                              this.getClassRoom(classId), 
                              [...mapProps,Props ]);
        } else {
          this.DeviceLists.set(
            this.getClassRoom(classId),
            [ Props ]
          )
        }
      }
    }
  }

  //客户端断开连接
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage("SEND_SIGN")
  async handleSendSign(client: Socket , payload: SignCreate) {
    // 处理收到的消息
    const { teacherId, classId, courseId } = payload;
    //获取唯一签到标识 
    const sign_id = `${teacherId}-${classId}-${courseId}`;
    // 插入临时 key-value 记录当前签到的签到id
    await this.RedisService.setKV('@' + sign_id, payload.SignId);

    const teacher = await this.TeacherDAO.getTeacherById(teacherId);
    try {
      const devs = [...new Set((this.DeviceLists.get(this.getClassRoom(classId)) || []).map( v => v.devices))];
      if(devs.length > 0)
        await broadCast(`${teacher.name}发来一条${payload.SignType}通知`, `${payload.SignTitle}`, devs);

      //开始计时
      this.RedisService.setKVEX(sign_id, JSON.stringify(payload), payload.SignDuration * 60);
    } catch (error) {
      console.log("意外错误", error);
    }
  }
}
