export class PaperCreateDTO{
  remark: string;
  name: string;
  total: number;
  classify: string;
  teacher_id: number;
}

export class PaperQueryDTO {
  classify: string;
  name: string;
  teacher_id: number;
}

export class PaperUpdateDTO {
  id: number;
  data: PaperCreateDTO;
}


export class RelaPaperSubjectsDTO {
  paperId: number;
  subjects: number[];
}