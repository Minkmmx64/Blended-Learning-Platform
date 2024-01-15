import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { RootStackParamList } from ".";
import { LoginScreen } from "../screen/LoginScreen";
import { MainBottomTab } from "../screen/Tab/MainBottomTab";
import { RegistScreen } from "../screen/RegistScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function MainNavigator() : JSX.Element {
  /**
   *  默认状态栏
   */
  useEffect(() => {
    StatusBar.setBackgroundColor("#ffffff");
    StatusBar.setBarStyle("dark-content");
    StatusBar.setTranslucent(true);
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerTitleAlign: "center",
        animation: "slide_from_right"
      }}>
        <Stack.Screen name="MainBottomTab" options = {{ headerShown: false }} component={ MainBottomTab } />
        <Stack.Screen name="LoginScreen" component={ LoginScreen } options={{
          headerTitle: "登录",
          animation: "fade_from_bottom",
        }} />
        <Stack.Screen name="RegistScreen" component={ RegistScreen } options={{
          headerTitle: "注册"
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}