import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { Column } from "../compoment/flex-box/Column";
import { ContainerBox } from "../compoment/ContainerBox";
import { FromProps, RenderForm } from "../compoment/Form/BaseForm";
import { useMemo, useRef, useState } from "react";
import { Rules, rpx } from "../utils/common";
import { Color } from "../utils/style";
import { Row } from "../compoment/flex-box/Row";
import { CheckBoxGroup, ICheckBoxValues } from "../compoment/Form/CheckBox";
import user , { RegisterData } from "../request/api/user";
const RegistFromProps: FromProps[] = [
  {
    label: "用户名",
    value: "mjw12345",
    placeholder: Rules.username.msg,
    prop: "username",
    regexp: Rules.username.rule
  },
  {
    label: "密码",
    value: "mjw12345",
    placeholder: "数字字母下划线4-20字符",
    prop: "password",
    regexp: Rules.username.rule
  },
  {
    label: "再次输入密码",
    value: "mjw12345",
    placeholder: "",
    prop: "bpassword",
    regexp: /.{1}/
  },
  {
    label: "手机号",
    value: "13989649041",
    placeholder: "请输入大陆手机号",
    prop: "phone",
    regexp: Rules.phone.rule
  }
];

interface FormRef {
  check: () => boolean;
  values: () => RegisterData & { bpassword: string; };
}

const LoginStyle = StyleSheet.create({
  Regist: {
    width: rpx(500),
    height: rpx(100),
    backgroundColor: Color.Danger,
    borderRadius: rpx(100),
    marginTop: rpx(200)
  },
  Auth : {
    width: rpx(600),
    height: rpx(100),
    borderWidth: rpx(1),
    borderColor: Color.Primary,
    borderRadius: rpx(100),
    textAlign: "center"
  }
});

const checkBoxValue: ICheckBoxValues<"student" | "teacher">[] = [
  { name: "我是学生", value: "student" }, 
  { name: "我是教师", value: "teacher" }
]

export function RegistScreen() {
  const FormRef = useRef<FormRef>(null);

  const UserRegist = async () => {
    if (FormRef.current?.check()) {
      const FormData = FormRef.current?.values();
      if(FormData.bpassword !== FormData.password) {
        Alert.alert("验证错误", "两次密码不一致");
        return;
      }

      const data: RegisterData = {
        username: FormData.username,
        password: FormData.password,
        phone: FormData.phone,
        type: type,
        student_code: auth,
        teacher_code: auth
      };

      const res = await user.regist(data);
      console.log(res);
      
    }
  }
  
  const [ type , setType ] = useState<"student" | "teacher">("student");
  const [ auth , setAuth ] = useState("");
  const _renderAuth = (str : string = type) => {
    return (
      <TextInput 
        style={ LoginStyle.Auth }
        onChangeText={ text => setAuth(text) }
        placeholder={`请输入${str === "student" ? "学号" : "教师号"}`} />
    )
  }

  return <>
    <ContainerBox style={{ marginTop: rpx(200) }}>
      <Column>
        {useMemo(() => <RenderForm form={RegistFromProps} ref={FormRef} />, [RegistFromProps])}
        <CheckBoxGroup 
          isChecked={0}
          checks={checkBoxValue} 
          onChange={ v => setType(v) }
        />
        { _renderAuth(type) }
        <TouchableOpacity
          style={LoginStyle.Regist}
          activeOpacity={0.8}
          onPress={ UserRegist }
        >
          <Row style={{ width: "100%", height: rpx(100) }}>
            <Text style={{ color: "#ffffff", fontSize: rpx(40), lineHeight: rpx(100)}}>注册</Text>
          </Row>
        </TouchableOpacity>
      </Column>
    </ContainerBox>
  </>
}