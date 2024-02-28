import { useEffect, useState } from "react";
import { ContainerBox } from "../../compoment/ContainerBox"
import { StackScreenProps } from "../../navigator"
import sign, { studentInitSignResData } from '../../request/api/sign';
import { Text } from "react-native";
import { WebSocketReduxProps } from "../../store/useWebSocketRedux";
import { connect } from "react-redux";
import { RootStoreRedux } from "../../store";

interface ReduxProps {
  useWebSocketRedux : WebSocketReduxProps
}

type ISignStatusScreenProps = StackScreenProps<"SignStatusScreen"> & ReduxProps;

const SignStatusScreen = ({ route, useWebSocketRedux } : ISignStatusScreenProps) : JSX.Element => {

  const [ signRes, setSignRes ] = useState<studentInitSignResData | null>();

  useEffect(() => {
    const { signId, studentId, classId } = route.params;
    // 用户进行签到
    sign.studentInitSign({signId, studentId}).then( res => {
      setSignRes(res.data);
      if(res.data.ok !== -1) {
        // 通知教师客户端有学生进行签到
        useWebSocketRedux.Socket?.emit("APP_STUDENT_SIGN", {
          signId: signId,
          studentId: studentId,
          classId: classId
        });
      }
    });
  }, []);

  return (
    <ContainerBox>
      <Text>{ signRes?.msg }</Text>
    </ContainerBox>
  )
}

const mapStateToProps = (state: RootStoreRedux, ownProps: StackScreenProps<"SignStatusScreen">): ReduxProps => {
  return {
    useWebSocketRedux: state.useWebSocketRedux
  };
};

export default connect(mapStateToProps)(SignStatusScreen);