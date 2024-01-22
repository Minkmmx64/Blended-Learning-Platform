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

}

export function Row(Props: IRow) {
  
  return (
    <View {...Props} style={{
      ...RowStyle.box,
      ...Props.style
    }}>
      { Props.children }
    </View>
  )
}