import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

//定义 APP Stack 注册的路由
export type RootStackParamList = {
  //底部导航
  MainBottomTab: undefined;
  //登录
  LoginScreen: undefined; 
  //注册
  RegistScreen: undefined;
  //课程信息
  CourseScreen: { courseId: number };
  //章节信息
  ChapterDetailScreen: { chapterId: number, chapterName: string };
  //签到信息
  SignScreen: undefined;
  //拍照
  CameraScreen: undefined;
  //扫码
  QRCodeScreen: {
    callBack: (data: string) => void;
  };
  //签到状态
  SignStatusScreen: {
    studentId: number;
    signId: number;
    classId: number;
  };
  //手势图案
  GesturesScreen: {
    signId: number;
    studentId: number;
    classId: number;
  }
}

//定义首页底部选项卡注册的路由
export type RootTabParamList = {
  IndexScreen: undefined;
  AdminScreen: undefined;
  MessageScreen: undefined;
  CourseScreen: undefined;
}


//组合路由, 你的导航器如果是有Tab和Stack共同功能的页面，使用CompositeScreenProps 组合你当前页面的导航器属性
//当前 Home 是 MainBottomTab 的 Tab 页面, MainBottomTab 是 Stack 页面
export type TabScreenProps<RouteName extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, RouteName>,
  StackScreenProps<keyof RootStackParamList>
>;

export type StackScreenProps<RouteName extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, RouteName>;





