import { Request } from "../env.";

export interface RegisterData {
  username: string;

  password: string;

  phone: string;

  type: "student" | "teacher";

  student_code?: string;

  teacher_code?: string;
}

export interface LoginData {
  username: string;

  password: string;
}

export class user extends Request {
  
  constructor(){
    super("/app/user");
  }

  public async regist( data : RegisterData) {
    return this.post("/regist", { ...data });
  }

  public async login( data: LoginData ) {
    return this.post("/login", { ...data });
  }
}

export default new user();