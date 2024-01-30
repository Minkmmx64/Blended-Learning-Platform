import { BaseScreenProps } from "../../compoment/compoment";
import { Row } from "../../compoment/flex-box/Row";
import { Column } from "../../compoment/flex-box/Column";
import { rpx } from "../../utils/common";
import { Image, Text, TouchableOpacity } from "react-native";

export interface UtilToolsBaseProps {
  label: string;
  icon: string;
}

export interface UtilToolsProps<T> extends BaseScreenProps {

  data: T[];

  ItemOnPress: (value: T) => void;

  renderTop?: JSX.Element;
  
}

{/** 常用工具 */ }
export function UtilTools<T extends UtilToolsBaseProps>(Props: UtilToolsProps<T>){
  
  return (
    <>
      { Props.renderTop || <></> }
      <Column style={ Props.style }>
        {
          Props.data.map((value, _) => {
            const dimension = 60;
            return (
              <TouchableOpacity 
                activeOpacity={1}
                onPress={ () => Props.ItemOnPress(value) }
                key={_}>
                <Row    
                  style={{ height: rpx(100), justifyContent: "flex-start", position: "relative" }}>
                  <Column style={{ height: "100%", width: rpx(80), marginRight: rpx(40) }}>
                    <Image style={{ width: rpx(dimension), height: rpx(dimension) }} source={{ uri: value.icon }} />
                  </Column>
                  <Text>{value.label}</Text>
                  <Column style={{ width: rpx(80), right: rpx(40), flex: 1, alignItems: "flex-end" }}>
                    <Image style={{ height: rpx(dimension / 2), width: rpx(dimension / 2) }} source={require("../../static/index/arrow.png")} />
                  </Column>
                </Row>
              </TouchableOpacity>
            );
          })
        }
      </Column>
    </>
  );
}
