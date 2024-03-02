import { Alert } from "react-native";
import { ContainerBox } from "../../compoment/ContainerBox"
import { Gestures } from "../../compoment/display/Gestures"
import { StackScreenProps } from "../../navigator";
import sign from "../../request/api/sign";
import { connect } from "react-redux";
import { RootStoreRedux } from "../../store";
import { WebSocketReduxProps } from "../../store/useWebSocketRedux";
import { Toast } from "../../compoment/display/toast/Toast";

interface ReduxProps {
  useWebSocketRedux: WebSocketReduxProps;
}

type IGesturesScreenProps = StackScreenProps<"GesturesScreen"> & ReduxProps;

const GesturesScreen = ({ route, useWebSocketRedux, navigation } : IGesturesScreenProps) : JSX.Element => {

  return (
    <ContainerBox>
      <Gestures 
        title="手势签到" 
        onResult={ async (res) => {
          const cipher = res.toString().split(",").join("");

          const { signId, studentId, classId } = route.params;
          const okMsg = await sign.studentVeriftSign(signId, cipher);
          if(okMsg.data.ok > 0){
            sign.studentInitSign({signId, studentId}).then( res => {
              if(res.data.ok !== -1) {
                Toast.show("签到成功");
                // 通知教师客户端有学生进行签到
                useWebSocketRedux.Socket?.emit("APP_STUDENT_SIGN", {
                  signId: signId,
                  studentId: studentId,
                  classId: classId
                });
                setTimeout(() => {
                  navigation.pop();
                }, 100);
              }
            });
            return true;
          }
          else {
            Toast.show("手势错误");
            return false;
          }
        }} 
      />
    </ContainerBox>
  )
}

const mapStateToProps = (state: RootStoreRedux, ownProps: StackScreenProps<"GesturesScreen">): ReduxProps => {
  return {
    useWebSocketRedux: state.useWebSocketRedux
  };
};

export default connect(mapStateToProps)(GesturesScreen);