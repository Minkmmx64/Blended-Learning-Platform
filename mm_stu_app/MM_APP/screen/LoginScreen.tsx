import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { WebSocketReduxProps, WsCC } from "../store/useWebSocketRedux.ts";
import { StackScreenProps } from "../navigator";
import React, { useEffect, useRef, useState } from "react";
import { ContainerBox } from "../compoment/ContainerBox";
import { Column } from "../compoment/flex-box/Column";
import { rpx } from "../utils/common";
import { Row } from "../compoment/flex-box/Row";
import { Color } from "../utils/style";
import { FromProps, RenderForm } from "../compoment/Form/BaseForm";
import { SvgXml } from "react-native-svg";
import common from '../request/api/common';
import user, { LoginData } from '../request/api/user';
import { connect } from "react-redux";
import { RootStoreRedux } from "../store";
import { Dispatch } from "redux";
import { AppUserReduxProps, setAppUser } from "../store/useAppUserRedux";
import { Toast } from "../compoment/display/toast/Toast";
import { SocketConnectData } from "../websocket/connect";

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
  },
  Sms: {
    width: rpx(700),
    justifyContent: "space-between",
    marginTop: rpx(40),
    borderBottomWidth: rpx(1),
    borderColor: Color.Default
  }
});

const LoginFromProps: FromProps[] = [
  {
    label: "用户名",
    value: "",
    placeholder: "",
    prop: "username",
  },
  {
    label: "密码",
    value: "",
    placeholder: "",
    prop: "password",
    secure: true
  },
];

interface FormRef {
  check: () => boolean;
  values: () => LoginData;
}

interface ReduxProps {

  useAppUserRedux: AppUserReduxProps;

  useWebSocketRedux: WebSocketReduxProps;
}

interface ReduxDispatch {
  setUserdata: (data: Partial<AppUserReduxProps>) => void;
  setWsConnect: (data: SocketConnectData) => void;
}

type LoginScreenProps = StackScreenProps<"LoginScreen"> & ReduxProps & ReduxDispatch; 

function LoginScreen({ navigation, setUserdata, setWsConnect, useWebSocketRedux }: LoginScreenProps) {

  const FormRef = useRef<FormRef>(null);

  const [sms, setSms] = useState("");
  const [smsText, setSmsText] = useState("");

  const loadSms = async () => {
    const { data } = await common.getSms();
    setSms(data);
  }

  useEffect(() => {
    loadSms();
    
    return () => {

    }
  }, []);

  const UserLogin = async () => {
    
    try {
      //验证验证码
      const verify = await common.VSms(smsText);
      if (verify.code >= 400) {
        Alert.alert("验证码错误");
        setSmsText("");
        loadSms();
        return;
      }

      if (FormRef.current?.check()) {
        const login = FormRef.current?.values();
        const { data } = await user.login(login);
        //插入用户登录信息
        setUserdata(data);
        //回退到主页
        navigation.pop();
        //登录成功
        Toast.show("登陆成功");
        setTimeout(() => {
          Toast.hide();
        }, 1000);
        /**
         * 登录连接WebSocket
         */
        setWsConnect({ })
      }
    } catch (error) {
      console.error(error);
    }
  }

  const UserRegist = () => {
    navigation.navigate("RegistScreen");
  }

  return (
    <>
      <ContainerBox style={{ paddingTop: rpx(200) }}>
        <Column>
          <RenderForm form={LoginFromProps} ref={FormRef} />
          <Row style={LoginStyle.Sms}>
            <Text style={{ width: rpx(200), textAlign: "center" }}>验证码:</Text>
            <TextInput
              defaultValue={ smsText }
              onChangeText={text => setSmsText(text)}
              style={{ flex: 1, marginRight: rpx(30) }} />
            <TouchableOpacity
              activeOpacity={1}
              onPress={loadSms}>
              {sms !== "" ? <SvgXml xml={sms} width={150} height={40} /> : <></>}
            </TouchableOpacity>
          </Row>
          <TouchableOpacity
            style={LoginStyle.Regist}
            activeOpacity={0.5}
            onPress={UserRegist}
          >
            <Row style={{ width: "100%", height: "100%", justifyContent: "flex-end", marginTop: rpx(40) }}>
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

const mapStateToProps = (state : RootStoreRedux, ownProps : LoginScreenProps) => {
  return {
    useAppUserRedux: state.useAppUserRedux,
    useWebSocketRedux: state.useWebSocketRedux
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ReduxDispatch => {
  return {
    setUserdata: (data) => setAppUser(dispatch)(data),
    setWsConnect: (data) => WsCC(dispatch)(data)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);