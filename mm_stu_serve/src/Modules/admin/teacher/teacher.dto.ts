export class TeacherCreateDTO{
  remark: string;
  name: string;
  profile: string;
  gender: "男" | "女";
  age: number;
  code: string;
}

export class TeacherQueryDTO {
  name: string;
  authentication: string;
}

export class TeacherUpdateDTO {
  id: number;
  data: TeacherCreateDTO;
}
