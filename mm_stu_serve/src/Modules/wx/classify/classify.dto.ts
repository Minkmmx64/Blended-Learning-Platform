
export class ClassifyCreateDTO{
  name: string;
  remark: string;
  avatar: string;
}

export class ClassifyQueryDTO {
  name: string;
}

export class ClassifyUpdateDTO {
  id: number;
  data: ClassifyCreateDTO;
}
