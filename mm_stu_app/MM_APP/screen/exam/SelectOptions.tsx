import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Column } from "../../compoment/flex-box/Column";
import { rpx } from "../../utils/common";
import { Color } from "../../utils/style";

type list_type = "letter" | "number" | "none";

interface ISelectOptionsProps {
  // 是否允许多选
  multiple ?: boolean;
  // 选项列表
  options: string[];
  // 左侧题目序号 字母 数字 不显示
  listtype ?: list_type;
}

const Style = StyleSheet.create({
  option: {
    height: rpx(80),
    borderWidth: rpx(0.5),
    width: rpx(650),
    marginTop: rpx(20),
    borderColor: Color.Primary,
    borderRadius: rpx(10),
    paddingLeft: rpx(40)
  }
})

export const SelectOptions = ( Props: ISelectOptionsProps ) : JSX.Element => {

  const _renderType = (_Props : { type: list_type, index: number }) : JSX.Element => {
    if(_Props.type === "letter") return <Text>{ String.fromCharCode("A".charCodeAt(0) + _Props.index) }、</Text>
    else if(_Props.type === "number") return <Text>{_Props.index}、</Text>
    return <></>
  }

  const ToSelect = (val: number) => {
    console.log(val);
  }

  return (
    <Column>
      { Props.options.map( (option, _) => {
        return (
          <TouchableOpacity 
            onPress={ToSelect.bind({}, _)}
            activeOpacity={1} key={_} style={{ ...Style.option, }}>
            <Column style={{ flex: 1, alignItems: "flex-start" }}>
              <Text> <_renderType type={Props.listtype ?? "none"} index={_}/> { option }</Text>
            </Column>
          </TouchableOpacity>
        );
      })}
    </Column>
  )
}