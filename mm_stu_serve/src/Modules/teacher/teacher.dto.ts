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
}

export class TeacherUpdateDTO {
  id: number;
  data: TeacherCreateDTO;
}
