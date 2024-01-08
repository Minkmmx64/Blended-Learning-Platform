import { StyleSheet, View } from "react-native";
import { BaseScreenProps } from "../compoment";
import { rpx } from "../../utils/common";

const ColumnStyle = StyleSheet.create({
  box: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: rpx(750)
  }
})

interface IColumn extends BaseScreenProps {

}

export function Column(Props: IColumn) {
  
  return (
    <View style={{
      ...ColumnStyle.box,
      ...Props.style
    }}>
      { Props.children }
    </View>
  )
}