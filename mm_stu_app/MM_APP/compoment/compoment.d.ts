import { ViewProps, ViewStyle } from "react-native";

export interface BaseScreenProps extends ViewProps {
  children?: JSX.Element | JSX.Element[];
  style?: ViewStyle
}