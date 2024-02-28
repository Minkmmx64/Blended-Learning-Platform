import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MapProps, SignCreate, SocketConnectData, StudentSign } from './webSocket.type';
import { Injectable } from '@nestjs/common';
import { StuDAO } from '../admin/stu/stu.dao';
import { TeacherDAO } from '../admin/teacher/teacher.dao';
import { RedisService } from '../redis/RedisService';
import { broadCastForAlias } from 'src/utils/JPush';
import { ClassDAO } from '../admin/class/class.dao';

@Injectable()
@WebSocketGateway(8082, { cors: { origin: "*" } })
export class WebSocket implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly TeacherDAO: TeacherDAO,
    private readonly StuDAO: StuDAO,
    private readonly RedisService: RedisService,
    private readonly ClassDAO: ClassDAO
  ) { }

  @WebSocketServer()
  server: Server;

  // 初始化服务
  afterInit(server: Server) {}

  //客户端断开连接
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  //获取房间号
  private getClassRoom = (classId: number) => `class:${classId}`;
  //设备别名列表
  private AliasLists = new Map<string, MapProps[]>();

  //连接ws服务器
  async handleConnection(client: Socket) {
    const data = JSON.parse(client.handshake.query.data as string) as SocketConnectData;
    if (data.type === "teacher") {
      // 该教师上线，将该教师加入到对应授课的班级房间
      // 获取教师所有课表
      const cls = await this.ClassDAO.getTeacherClassGroup(data.id);
      const ids = cls.map(group => group.class.id);
      client.join(ids.map(id => this.getClassRoom(id)));
    } else {
      if (data.devices_id) {
        const stu = await this.StuDAO.getStudentById(data.id)
        const classId = stu.class.id;
        //将该学校添加到同一个班级
        client.join(this.getClassRoom(classId));
        //console.log(`学生:${stu.name} 加入到 班级群 ${stu.class.id} = ${stu.class.name}`);
        //添加一条alias信息到该班级
        const mapProps = this.AliasLists.get(this.getClassRoom(classId));
        const Props: MapProps = { id: data.id.toString() }
        if (mapProps && mapProps.length > 0) {
          this.AliasLists.set(
            this.getClassRoom(classId),
            [...mapProps, Props]);
        } else {
          this.AliasLists.set(
            this.getClassRoom(classId),
            [Props]
          )
        }
      }
    }
  }

  @SubscribeMessage("TEST")
  handleTest() {
    console.log("测试");
    return "Test";
  }

  @SubscribeMessage("SEND_SIGN")
  async handleSendSign(@MessageBody() payload: SignCreate) {
    //console.log(" === 收到一条发起签到通知 ===", payload);
    const { teacherId, classId, courseId } = payload;
    //获取唯一签到标识 
    const sign_id = `${teacherId}-${classId}-${courseId}`;
    try {
      // 插入临时 key-value 记录当前签到的签到id 
      //console.log("发起了一条签到::", "redis key:", '@' + sign_id);
      await this.RedisService.setKV('@' + sign_id, payload.SignId);
      const teacher = await this.TeacherDAO.getTeacherById(teacherId);
      const devs = [...new Set((this.AliasLists.get(this.getClassRoom(classId)) || []).map(v => v.id))];
      if (devs.length > 0)
        await broadCastForAlias(
                    `${teacher.name}发来一条${payload.SignType}通知`, 
                    `${payload.SignTitle}`, 
                    devs
              );
      this.RedisService.setKVEX(sign_id, JSON.stringify(payload), payload.SignDuration * 60);
    } catch (error) {
      console.log("意外错误", error);
    }
    return;
  }

  @SubscribeMessage("APP_STUDENT_SIGN")
  async handleStudentSign(@MessageBody() payload: StudentSign) {
    //console.log(payload);
    // app端发起签到，发送给教师客户端
    this.server.to(this.getClassRoom(payload.classId)).emit("APP_STUDENT_SIGN", payload);
  }
}
