export class CourseCreateDTO{
  name: string;
  avatar: string;
  remark: string;
  college_id: number;
}

export class CourseQueryDTO {
  name: string;
  college_id: number;
}

export class CourseUpdateDTO {
  id: number;
  data: CourseCreateDTO;
}
