export class CourseCreateDTO{
  name: string;
  avatar: string;
  remark: string
}

export class CourseQueryDTO {
  name: string;
}

export class CourseUpdateDTO {
  id: number;
  data: CourseCreateDTO;
}
