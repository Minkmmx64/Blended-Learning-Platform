export class SubjectCreateDTO{
  remark: string;
  describe: string;
  type: SubjectType;
  result: string;
  classify: string;
  options: string[];
}

export enum SubjectType {
  Signal = "单选题",
  Multiple = "多选题",
  Profile = "简答题",
  Judge = "判断题"
}

export class SubjectQueryDTO {
  type: SubjectType;
  classify: string;
  describe: string;
}

export class SubjectUpdateDTO {
  id: number;
  data: SubjectCreateDTO;
}
