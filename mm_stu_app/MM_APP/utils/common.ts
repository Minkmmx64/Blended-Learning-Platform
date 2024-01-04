import { Platform } from "react-native";

export function isAndroid() {
  return Platform.OS === "android";
}

export const navBarHeight = isAndroid() ? 56 : 44;