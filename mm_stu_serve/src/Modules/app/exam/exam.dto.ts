export interface ExamResultDTO {
  dataId: {
    studentId: number,
    paperId: number,
    examId: number
  },
  dataRes: SubjectAnswer[]
}

export interface SubjectAnswer {
  id: number,
  value: string
}