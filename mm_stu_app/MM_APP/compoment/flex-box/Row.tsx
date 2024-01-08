import { StyleSheet, View } from "react-native";
import { BaseScreenProps } from "../compoment";
import { rpx } from "../../utils/common";

const RowStyle = StyleSheet.create({
  box: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: rpx(750)
  }
})

interface IRow extends BaseScreenProps {

}

export function Row(Props: IRow) {
  
  return (
    <View style={{
      ...RowStyle.box,
      ...Props.style
    }}>
      { Props.children }
    </View>
  )
}