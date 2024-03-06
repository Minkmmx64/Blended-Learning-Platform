import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { StatusBar } from "react-native";
import { RootStackParamList } from ".";
import LoginScreen from "../screen/LoginScreen";
import { MainBottomTab } from "../screen/Tab/MainBottomTab";
import { RegistScreen } from "../screen/RegistScreen";
import { CourseScreen } from "../screen/course/CourseScreen";
import { ChapterDetailScreen } from "../screen/course/ChapterDetailScreen";
import SignScreen from "../screen/sign/SignScreen";
import { CameraScreen } from "../screen/CameraScreen";
import { QRCodeScreen } from "../screen/QRCode/QRCodeScreen";
import SignStatusScreen from "../screen/sign/SignStatusScreen";
import GesturesScreen from "../screen/sign/GesturesScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export interface IMainNavigatorRef {
  navigator: <T extends keyof RootStackParamList>(nav: T) => void;
}

export const MainNavigator = forwardRef((Props, ref: React.ForwardedRef<IMainNavigatorRef>) : JSX.Element => {
  /**
   *  默认状态栏
   */
  useEffect(() => {
    StatusBar.setBackgroundColor("#ffffff");
    StatusBar.setBarStyle("dark-content");
    StatusBar.setTranslucent(true);
  }, [])

  const NavigatorRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useImperativeHandle(ref, () => ({
    navigator: (nav) => {
      NavigatorRef.current?.navigate(nav as any)
    }
  }));

  return (
    <NavigationContainer ref={NavigatorRef}>
      <Stack.Navigator screenOptions={{
        headerTitleAlign: "center",
        animation: "slide_from_right",
      }}>
        <Stack.Screen name="MainBottomTab" options = {{ headerShown: false }} component={ MainBottomTab } />
        <Stack.Screen name="LoginScreen" component={ LoginScreen as any } options={{
          headerTitle: "登录",
          animation: "fade_from_bottom",
        }} />
        <Stack.Screen name="RegistScreen" component={ RegistScreen } options={{
          headerTitle: "注册"
        }} />
        <Stack.Screen name="CourseScreen" component={ CourseScreen } options={{
          headerTitle: "课程信息"
        }} />
        <Stack.Screen name="ChapterDetailScreen" component={ ChapterDetailScreen } />
        <Stack.Screen name="SignScreen" component={ SignScreen } options={{ headerTitle: "我的签到" }} />
        <Stack.Screen name="CameraScreen" component={ CameraScreen } options={{
          headerShown: false,
          animation: "slide_from_bottom"
        }} />
        <Stack.Screen name="QRCodeScreen" component={ QRCodeScreen } options={{
          headerShown: false,
          animation: "slide_from_bottom"
        }} />
        <Stack.Screen name="SignStatusScreen" component={ SignStatusScreen } options={{ headerTitle: "签到状态" }} />
        <Stack.Screen name="GesturesScreen" component={ GesturesScreen } options={{ headerTitle: "绘制手势" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
})