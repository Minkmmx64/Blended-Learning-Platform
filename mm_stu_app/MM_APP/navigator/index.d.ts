import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

//定义 APP Stack 注册的路由
export type RootStackParamList = {
  MainBottomTab: undefined;
  LoginScreen: undefined; 
  RegistScreen: undefined;
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
  StackScreenProps<RootStackParamList>
>;

export type StackScreenProps<RouteName extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, RouteName>;





