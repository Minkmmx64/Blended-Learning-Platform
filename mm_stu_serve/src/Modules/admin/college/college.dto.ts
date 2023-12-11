export class StuCollegeCreateDTO {
  name: string;
  remark?: string;
  code: string;
}

export class StuCollegeQueryDTO {
  name: string;
}

export class CollegeUpdateDTO {
  id: number;
  data: StuCollegeCreateDTO;
}