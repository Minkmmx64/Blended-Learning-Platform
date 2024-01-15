export class StuCreateDTO{
  remark: string;
  student: string;
  school: string;
  name: string;
  native: string;
  year: number;
  gender: "男" | "女";
  age: number;
  class_id: number;
  avatar: string;
}

export class StuQueryDTO {
  class_id: number;
  name: string;
}

export class StuUpdateDTO {
  id: number;
  data: StuCreateDTO;
}
