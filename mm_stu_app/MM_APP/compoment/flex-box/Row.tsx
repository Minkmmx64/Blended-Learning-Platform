import { StyleSheet, View } from "react-native";
import { BaseScreenProps } from "../compoment";
import { rpx } from "../../utils/common";

const RowStyle = StyleSheet.create({
  box: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
    flexWrap: "wrap"
  }
})

interface IRow extends BaseScreenProps {
  /**
  * 垂直外边距
  */
  gapV?: number;
  /*
  * 水平外边距
  */
  gapH?: number;
}

export function Row(Props: IRow) {
  
  return (
    <View {...Props} style={{
      ...RowStyle.box,
      marginHorizontal: Props.gapH ?? 0,
      marginVertical: Props.gapV ?? 0,
      ...Props.style,
    }}>
      { Props.children }
    </View>
  )
}