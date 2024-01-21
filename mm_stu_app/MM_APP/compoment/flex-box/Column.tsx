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
    width: rpx(750),
    position: "relative"
  }
})

interface IColumn extends BaseScreenProps {

}

export const Column = (Props: IColumn) => {
  
  return (
    <View {...Props} style={{
      ...ColumnStyle.box,
      ...Props.style
    }}>
      { Props.children }
    </View>
  )
};