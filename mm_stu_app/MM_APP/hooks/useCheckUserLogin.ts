import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, EventArg } from "@react-navigation/native";
import { RootStackParamList, RootTabParamList } from "../navigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DependencyList, useEffect } from "react";
import { AppUserReduxProps } from "../store/useAppUserRedux";

export function useCheckUserLoginOnTabPress<NavName extends keyof RootTabParamList>(
  navigation: 
    CompositeNavigationProp<
                            BottomTabNavigationProp<RootTabParamList, NavName, undefined>, 
                            NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList, undefined>
    >,
  useAppUserRedux: AppUserReduxProps,
  deps: DependencyList
  ) {
    
    const checkUserStatus = (e : EventArg<"tabPress", true, undefined>) => {
      if(useAppUserRedux.id === -1) {
        e.preventDefault();
        navigation.push("LoginScreen");
      };
    }

  useEffect(() => {
    const SubscribeFocus = navigation.addListener("focus", e => {
      
    });
    const SubscribeTabPress = navigation.addListener("tabPress", checkUserStatus);
    return () => {
      SubscribeTabPress();
      SubscribeFocus();
    };
  }, deps);
}