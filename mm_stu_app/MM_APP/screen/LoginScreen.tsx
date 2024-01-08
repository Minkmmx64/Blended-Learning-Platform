import { Animated, Image, StyleSheet, Text, TextInput } from "react-native";
import { StackScreenProps } from "../navigator";
import { useEffect, useRef, useState } from "react";
import { ContainerBox } from "../compoment/ContainerBox";
import { Column } from "../compoment/flex-box/Column";
import { rpx } from "../utils/common";
import { Row } from "../compoment/flex-box/Row";
import { Color } from "../utils/style";

const LoginStyle = StyleSheet.create({
  From: {
    height: rpx(100),
    justifyContent: "space-around",
    borderBottomWidth: rpx(1),
    width: rpx(700)
  }
})

interface FromProps {
  label: string;
  value: string;
  placeholder: string
}

const LoginFromProps: FromProps[] = [
  {
    label: "用户名",
    value: "",
    placeholder: "输入用户名"
  },
  {
    label: "密码",
    value: "",
    placeholder: "输入密码"
  },
]

export function LoginScreen({ navigation }: StackScreenProps<"LoginScreen">) {
  const [login, setLogin] = useState(LoginFromProps);

  const _render = () => {
    return <>
      {login.map((props, index) => {
        const [ color, setColor ] = useState(Color.default);
        return (
          <Row key={index} style={{ ...LoginStyle.From, borderColor: color }}>
            <Text>{props.label}</Text>
            <TextInput
              defaultValue={props.value}
              style={{ width: rpx(400) }}
              onChangeText={text => {
                const data = JSON.parse(JSON.stringify(login)) as FromProps[];
                data[index] = {
                  ...props,
                  value: text
                }
                setLogin(data);
              }}
              onFocus={ () => setColor(Color.Primary) }
              onBlur={ () => setColor(Color.default) }
              placeholder={props.placeholder} />
          </Row>
        )
      })}
    </>
  }

  return (
    <>
      <ContainerBox style={{ marginTop: rpx(200) }}>
        <Column>
          {_render()}
        </Column>
      </ContainerBox>
    </>
  )
}
