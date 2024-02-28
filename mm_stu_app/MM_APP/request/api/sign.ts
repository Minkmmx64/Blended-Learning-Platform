import { Request, RequestData } from "../env.";

export enum Sign {
  Gestures = "手势签到",
  QRcode = "二维码签到",
  Online = "在线签到"
}

export interface ISign {
	id: number;
	name: string;
	type: Sign;
	start: string;
	end: string;
	course: Course;
	teacher: Teacher;
}

interface Course {
	id: number;
	name: string;
}

interface Teacher {
	id: number;
	name: string;
}

export interface SignProps {
	id: number;
	successful: boolean;
	sign: ISign;
}

export interface studentInitSignResData {
  ok: number;
  msg: string;
} 

export class sign extends Request {
  constructor() {
    super("/app/sign");
  }

  //加载学校历史签到
  public async getStuSign(studentId: number) : Promise<RequestData<SignProps[]>> {
    return this.get(`/${studentId}`);
  }

  //进行签到
  public async studentInitSign(data: { studentId: number , signId: number }) : Promise<RequestData<studentInitSignResData>> {
    return this.post("/init", data);
  }
}

export default new sign();