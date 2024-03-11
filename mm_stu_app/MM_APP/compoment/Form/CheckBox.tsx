import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Row } from "../flex-box/Row";
import { rpx } from "../../utils/common";
import { Color } from "../../utils/style";

export type ICheckBoxValues<T> = Omit<ICheckBox<T>, "index" | "isCheck">;

export interface ICheckBoxGroup<T> {
  checks: ICheckBoxValues<T>[];
  isChecked: number;
  onChange: (value: T) => void;
}

export function CheckBoxGroup<T>(Props: ICheckBoxGroup<T>) {
  const [ v, setV ] = useState(Props.isChecked);
  return (
    <Row style={{ width: "100%", marginTop: rpx(15), justifyContent: "flex-start" }}>
      {Props.checks.map( (check, index ) => {
        return <CheckBox onChange={ val => { 
          if(val === v) {
            setV(-1)
            Props.onChange(null as T);
            return 
          }
          setV(val), Props.onChange(check.value)
        } } isCheck={v}  key={index} index={index}  name={check.name} value={check.value} />
      })}
    </Row>
  )
}

export interface ICheckBox<T> {
  //复选框name
  name: string;
  //复选框value
  value: T;
  //复选框index
  index: number;
}

interface ICheckBoxProps {
  //当前选中
  isCheck: number;
  //选中复选框
  onChange: (value: number) => void;
}

const CheckBoxStyle = StyleSheet.create({
  CheckBox: {
    width: rpx(30),
    height: rpx(30),
    borderWidth: rpx(2),
    borderColor: Color.Primary,
    marginRight: rpx(15)
  },
  BoxText: {
    width: "100%",
    height: "100%",
  }
});

export function CheckBox<T>(Props: ICheckBoxProps & ICheckBox<T>) {

  return (
    <>
      <Row style={{ height: rpx(100), width:"100%" }}>
        <TouchableOpacity style={{ width: "100%" }} activeOpacity={1} onPress={() => Props.onChange(Props.index)}>
          <Row style={{ height: rpx(100), width:"100%" }}>
            {Props.isCheck === Props.index ? 
              <View style={{...CheckBoxStyle.CheckBox, backgroundColor: Color.Primary}}>
                <Image style={CheckBoxStyle.BoxText} source={{ uri: "http://124.220.176.205:8080/image/78222d58fd831a4c325f38aadc9c35f9.png"}} />
              </View> : 
              <View style={CheckBoxStyle.CheckBox}></View>}
            <Text>{Props.name}</Text>
          </Row>
        </TouchableOpacity>
      </Row>
    </>
  )
}