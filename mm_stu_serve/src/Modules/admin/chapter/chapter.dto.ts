
export class ChapterCreateDTO{
  name: string;
  pid?: number;
  course:number;
  remark: string;
  cover: string;
}

export class ChapterQueryDTO {
  course?:number;
  name:string;
  pid?:number;
}

export class ChapterUpdateDTO {
  id: number;
  data: ChapterCreateDTO;
}
