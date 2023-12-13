export class ClassCreateDTO {
  name: string;
  remark: string;
  college_id: number;
  code: string;
}

export class ClassUpdateDTO {
  id: number;
  data: ClassCreateDTO;
}

export class ClassQueryDTO {
  college_id: number;
  name: string;
}

export class UpdateClassTableDTO {
  list: {
    teacher_id: number;
    course_id: number;
    json: string;
  }[];
}