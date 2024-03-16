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

export interface AssignGroupDTO {
	exam_id: number;
	exam_name: string;
	course_id: number;
	course_name: string;
	count: string;
	successful: string;
	uncommitted: string;
	waiting: string;
  class_id: number,
  class_name: string;
}

export interface StudentAnswerDTO {
  studentId: number;
  examId: number;
  subjectId: number;
  ultimate: number;
  comment: string;
}