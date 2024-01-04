import {  StatusBar, StatusBarProps, StyleSheet, View } from "react-native";
import { isAndroid } from "../utils/common";
import { SafeAreaView } from "react-native-safe-area-context";
import { BaseScreenProps } from "./compoment";

interface ContainerBoxProps extends BaseScreenProps {
  StatusBarOptions?: StatusBarProps;
  isFocuse?: boolean;
}

const PlatformViewStyle = StyleSheet.create({
  ContainerBox: {
    flexDirection: "column",
    alignItems: "center"
  }
});

const PlatformView = (Props: BaseScreenProps) : JSX.Element => {
  return <>
    { isAndroid() ? <View style={PlatformViewStyle.ContainerBox}>{Props.children}</View> 
                  : 
                  <SafeAreaView style={PlatformViewStyle.ContainerBox}>{Props.children}</SafeAreaView>
    }   
  </>
}

export function ContainerBox(Props : ContainerBoxProps) : JSX.Element  {

  return(
    <>
      { Props.isFocuse ? <StatusBar {...Props.StatusBarOptions}  /> : <></>}
      <PlatformView>{Props.children}</PlatformView>
    </>
  );
}