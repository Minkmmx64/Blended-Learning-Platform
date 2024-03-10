export class ExamCreateDTO{
  name: string;
  paperId: number;
  time: string;
  courseId: number;
  classId: number;
  teacherId: number;
}

export class ExamQueryDTO {

}

export class ExamUpdateDTO {
  id: number;
  data: ExamCreateDTO;
}
