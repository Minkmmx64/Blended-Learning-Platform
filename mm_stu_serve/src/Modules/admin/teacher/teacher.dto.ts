export class TeacherCreateDTO{
  remark: string;
  name: string;
  profile: string;
  gender: "男" | "女";
  age: number;
  code: string;
  authentication?: "已认证" | "待认证";
}

export class TeacherQueryDTO {
  name: string;
  authentication: string;
}

export class TeacherUpdateDTO {
  id: number;
  data: TeacherCreateDTO;
}

export class RealCourseDTO {
  id: number;
  course: number[];
}
