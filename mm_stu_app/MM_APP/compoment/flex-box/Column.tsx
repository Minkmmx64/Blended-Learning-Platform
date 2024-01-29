import { StyleSheet, View } from "react-native";
import { BaseScreenProps } from "../compoment";
import { rpx } from "../../utils/common";
import React from "react";

const ColumnStyle = StyleSheet.create({
  box: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative"
  }
})

interface IColumn extends BaseScreenProps {
  /**
   * 垂直外边距
   */
  gapV?: number;
  /*
  * 水平外边距
  */
  gapH?: number;
}

export const Column = (Props: IColumn) => {

  return (
    <View {...Props} style={{
      ...ColumnStyle.box,
      marginHorizontal: Props.gapH ?? 0,
      marginVertical: Props.gapV ?? 0,
      ...Props.style
    }}>
      {Props.children}
    </View>
  )
};