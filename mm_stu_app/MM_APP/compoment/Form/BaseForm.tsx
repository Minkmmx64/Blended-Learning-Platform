import { MutableRefObject, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Color } from "../../utils/style";
import { Column } from "../flex-box/Column";
import { Image, StyleSheet, Text, TextInput } from "react-native";
import { rpx } from "../../utils/common";
import { Row } from "../flex-box/Row";

export interface FromProps {
  // 表单标题
  label: string;
  // 表单初始值
  value: string;
  // 表单显示文字
  placeholder: string;
  // 表单属性字段
  prop: string;
  // 验证
  regexp?: RegExp;
}

interface _ItemRef {
  vaule: () => string;
  regular: (text: string, regex?: RegExp) => boolean;
}

const LoginStyle = StyleSheet.create({
  From: {
    height: rpx(100),
    justifyContent: "space-around",
    borderBottomWidth: rpx(1),
    width: rpx(700)
  },
  ItemIcon: {
    width: rpx(20),
    height: rpx(20),
    position: "absolute",
    right: rpx(20)
  },
  Label: {
    color: Color.Info, 
    width: rpx(200), 
    textAlign: "center",
    borderRightWidth: 0.5, 
    borderRightColor: Color.Info
  }
})

export const RenderForm = forwardRef(({ form }: { form: FromProps[] }, ref) => {
  const success_icon = "http://124.220.176.205:8080/image/acc178a3ae750789a8352c2909ed486f.png";
  const warning_icon = "http://124.220.176.205:8080/image/0bfc3e5483de1a836dca0aa3b0460e46.png";
  const ItemRefs = [] as MutableRefObject<_ItemRef>[];
  for (let i = 0; i < form.length; i++) ItemRefs[i] = useRef() as MutableRefObject<_ItemRef>;

  const check = () => {
    const res = ItemRefs.map((c, index) => c.current.regular(c.current.vaule(), form[index].regexp));
    return res.reduce((pre, cur) => pre && cur, true);
  }

  const getdata = () => form.reduce(( pre , cur , index ) => {
    return Object.assign(pre, { [cur.prop ]: ItemRefs[index].current?.vaule()});
  }, {});

  useImperativeHandle(ref, () => ({
    check: check,
    values: getdata
  }));

  const _item = forwardRef(({ props, index }: { props: FromProps, index: number }, _ref) => {
    const [color, setColor] = useState(Color.Default);
    const [p_color, setPColor] = useState(Color.Info);
    const [icon, setIcon] = useState(success_icon);
    const [text, setText] = useState(props.value);
    const from_icon = () => <Image style={LoginStyle.ItemIcon} source={{ uri: icon }} />
    const regular = (text: string, regex?: RegExp) => {
      if(!regex) return true;
      const ret = regex.test(text);
      if (ret) {
        setColor(Color.Default), setPColor(Color.Default), setIcon(success_icon);
      }
      else {
        setColor(Color.Danger), setPColor(Color.Danger), setIcon(warning_icon);
      }
      return ret;
    }
    useImperativeHandle(_ref, () => ({
      vaule: () => text,
      regular: (text: string, regex: RegExp) => regular(text, regex)
    }));

    return (
      <Row style={{ ...LoginStyle.From, borderColor: color }}>
        <Text style={LoginStyle.Label}>{props.label}</Text>
        <TextInput
          key={index}
          placeholderTextColor={p_color}
          defaultValue={text}
          style={{ width: rpx(400) }}
          onChangeText={text => setText(text)}
          onFocus={() => setColor(Color.Primary)}
          onBlur={() => regular(text, props.regexp)}
          placeholder={props.placeholder} />
        {p_color !== Color.Info ? from_icon() : <></>}
      </Row>
    );
  });

  return <>
    <Column>
      {form.map((props, index) => <_item ref={ItemRefs[index]} key={index} props={props} index={index} />)}
    </Column>
  </>
})