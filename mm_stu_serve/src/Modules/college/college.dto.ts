export class StuCollegeCreateDTO {
  name: string;
  remark?: string;
}

export class StuCollegeQueryDTO {
  name: string;
}

export class CollegeUpdateDTO {
  id: number;
  data: StuCollegeCreateDTO;
}