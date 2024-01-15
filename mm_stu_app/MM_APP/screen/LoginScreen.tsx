import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { StackScreenProps } from "../navigator";
import React, { useRef } from "react";
import { ContainerBox } from "../compoment/ContainerBox";
import { Column } from "../compoment/flex-box/Column";
import { rpx } from "../utils/common";
import { Row } from "../compoment/flex-box/Row";
import { Color } from "../utils/style";
import { FromProps, RenderForm } from "../compoment/Form/BaseForm";

const LoginStyle = StyleSheet.create({
  Login: {
    width: rpx(500),
    height: rpx(100),
    backgroundColor: Color.Primary,
    borderRadius: rpx(100),
    marginTop: rpx(500)
  },
  Regist: {
    width: rpx(700),
    height: rpx(60),
    borderRadius: rpx(100),
    marginTop: rpx(20),
  }
});

const LoginFromProps: FromProps[] = [
  {
    label: "用户名",
    value: "",
    placeholder: "",
    prop: "username",
    regexp: /.{1}/
  },
  {
    label: "密码",
    value: "",
    placeholder: "",
    prop: "password",
    regexp: /.{1}/
  },
];

interface FormRef {
  check: () => boolean;
  values: () => Object;
}

export function LoginScreen({ navigation }: StackScreenProps<"LoginScreen">) {

  const FormRef = useRef<FormRef>(null);

  const UserLogin = () => {
    if(FormRef.current?.check()) {
      Alert.alert("验证成功", JSON.stringify(FormRef.current?.values()));
    }
  }

  const UserRegist = () => {
    navigation.navigate("RegistScreen");
  }

  

  return (
    <>
      <ContainerBox style={{ marginTop: rpx(200) }}>
        <Column>
          <RenderForm form={LoginFromProps} ref={FormRef} />
          <TouchableOpacity
            style={LoginStyle.Regist}
            activeOpacity={0.5}
            onPress={ UserRegist }
          >
            <Row style={{ width: "100%", height: "100%", justifyContent: "flex-end" }}>
              <Text style={{ color: Color.Danger, fontSize: rpx(35), borderBottomWidth: 0.5 }}>没有账号? 去注册</Text>
            </Row>
          </TouchableOpacity>
          <TouchableOpacity
            style={LoginStyle.Login}
            activeOpacity={0.8}
            onPress={UserLogin}
          >
            <Row style={{ width: "100%", height: "100%" }}>
              <Text style={{ color: "#ffffff", fontSize: rpx(40), lineHeight: rpx(100) }}>登录</Text>
            </Row>
          </TouchableOpacity>
        </Column>
      </ContainerBox>
    </>
  );
}
