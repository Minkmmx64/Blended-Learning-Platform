import { Sign } from "../admin/sign/sign.dto";

export interface SocketConnectData {
  type: "student" | "teacher";
  id: number;
  devices_id: string | null;
}

export interface SignCreate {
  SignType: Sign,
  SignDuration: number;
  SignTitle: string;
  SignCipher: string | null;
  classId: number,
  courseId: number;
  teacherId: number;
  SignId: number;
}


export interface MapProps {
  //devices: string;
  id: string;
}

export interface StudentSign {
  signId: number;
  studentId: number;
  classId: number;
}

export interface ExamCreate {
  name: string;
  paperId: string;
  time: string;
  courseId: string;
  classId: string;
  teacherId: number;
}