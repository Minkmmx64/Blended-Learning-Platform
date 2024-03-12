export interface ExamResultDTO {
  dataId: {
    studentId: number,
    paperId: number,
    examId: number
  },
  dataRes: {
    id: number,
    value: string
  }[]
}