export class RegisterData {
  username: string;

  password: string;

  phone: string;

  type: "student" | "teacher";

  student_code : string;

  teacher_code : string;
}

export class LoginData {
  username: string;

  password: string;
}