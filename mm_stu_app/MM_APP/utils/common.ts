import { Dimensions, Platform } from "react-native";

export function isAndroid() {
  return Platform.OS === "android";
}

export const navBarHeight = isAndroid() ? 56 : 44;

//设备宽度
export const Device_W = Dimensions.get("window").width;

//设备高度
export const Device_H = Dimensions.get("window").height;

//
export const rpx = (val: number) => val * (Device_W / 750);
