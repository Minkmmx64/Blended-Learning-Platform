import { Request } from "../env.";

export interface RegisterData {
  username: string;

  password: string;

  phone: string;

  type: "student" | "teacher";

  student_code?: string;

  teacher_code?: string;
}

export class user extends Request {
  
  constructor(){
    super("/app/user");
  }

  public async regist( data : RegisterData) {
    return this.post("/regist", { ...data });
  }
}

export default new user();