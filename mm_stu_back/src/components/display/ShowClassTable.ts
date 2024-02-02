export const weaks = ["一", "二", "三", "四", "五", "六", "日"] as const;
export const times = [1, 2, 3, 4, 5, "中午", 6, 7, 8, 9, "晚上", 10, 11, 12];

export interface ICourses {
  weak: typeof weaks[number];     //星期几
  time: number;                   //第几节课
  rowspan: number;                //上几节
  teacher: string;
  course: string;
  class: string;
}

export interface IProps {
  courses: ICourses[];
}