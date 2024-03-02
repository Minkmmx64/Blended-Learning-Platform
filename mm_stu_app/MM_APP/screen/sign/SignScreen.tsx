import { FlatList, Image, RefreshControl, StyleSheet, Text, ToastAndroid, TouchableOpacity } from "react-native"
import { connect } from "react-redux";
import { RootStoreRedux } from "../../store";
import { StackScreenProps } from "../../navigator";
import { AppUserReduxProps } from "../../store/useAppUserRedux";
import { Dispatch } from "redux";
import sign, { Sign, SignProps, ISign } from '../../request/api/sign';
import { useEffect, useState } from "react";
import { Toast } from "../../compoment/display/toast/Toast";
import { ContainerBox } from "../../compoment/ContainerBox";
import { Row } from "../../compoment/flex-box/Row";
import { rpx } from "../../utils/common";
import { Column } from "../../compoment/flex-box/Column";
import { Color } from "../../utils/style";
import { WebSocketReduxProps } from "../../store/useWebSocketRedux";
import { QRCodeProps } from "../QRCode/QRCode.type";

interface ReduxProps {
  useAppUserRedux : AppUserReduxProps;
  useWebSocketRedux : WebSocketReduxProps
}

interface ReduxDispatch {

}

type ISignScreenProps = ReduxDispatch & ReduxProps & StackScreenProps<"SignScreen">;

const SignScreen = ({ useAppUserRedux, navigation }: ISignScreenProps): JSX.Element => {

  const ItemStyle = StyleSheet.create({
    Main: {
      justifyContent: "flex-start",
      borderColor: Color.Default,
      borderWidth: rpx(1),
      paddingLeft: rpx(10),
      paddingTop: rpx(20),
      paddingBottom: rpx(20),
      borderRadius: rpx(10),
      marginTop: rpx(10),
      paddingRight: rpx(20),
      width: "90%",
      alignSelf: "center"
    },
    Right: {
      flex: 1
    },
    Img: {
      width: rpx(60),
      height: rpx(60),
      marginRight: rpx(20)
    }
  });

  const [signDatas, setSignDatas] = useState<SignProps[]>([]);

  const [ refreshing, setRefreshing ] = useState(false);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    if (useAppUserRedux.student?.id) {
      sign.getStuSign(useAppUserRedux.student.id).then(({ data }) => {
        setRefreshing(false);
        setSignDatas(data);
      }).catch(error => {
        Toast.show("请求签到历史错误", error);
      });
    }
  }

  return (
    <ContainerBox>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        style={{ width: "100%" }}
        data={ signDatas }
        renderItem={value => {
          const signOk = value.item.successful;
          const activateSign = (data: SignProps) => {
            if(Date.now() > new Date(data.sign.end).getTime()) {
              Toast.show("签到结束");
              return;
            }
            if(data.successful) return Toast.show("您已签到");
            switch (data.sign.type) {
              case Sign.Gestures:
                //手势签到
                navigation.push("GesturesScreen", {
                  signId: data.sign.id,
                  studentId: useAppUserRedux.student!.id,
                  classId: useAppUserRedux.student!.class!.id
                });
                break;
              case Sign.Online:
                //点击签到
                //学生进行本次签到
                navigation.push("SignStatusScreen", {
                  signId: data.sign.id,
                  studentId: useAppUserRedux.student!.id,
                  classId: useAppUserRedux.student!.class!.id
                });
                break;
              case Sign.QRcode:
                //二维码签到
                navigation.push("QRCodeScreen", {
                  callBack: ( qr ) => {
                    const qrRes = JSON.parse(qr) as QRCodeProps<"QRSign">;
                    if(!qrRes.event.startsWith("MM:")) Toast.show("无效二维码");
                    if(qrRes.event === "MM:QRSign") {
                      navigation.push("SignStatusScreen", {
                        signId: data.sign.id,
                        studentId: useAppUserRedux.student!.id,
                        classId: useAppUserRedux.student!.class!.id
                      });
                    } 
                  }
                });
                break;
              default:
                break;
            }
          }
          return (
            value.item &&
            <TouchableOpacity 
              onPress={ activateSign.bind(this, value.item) }
              style={ItemStyle.Main} activeOpacity={1}>
              <Row>
                {
                  signOk ?
                    <Image style={ItemStyle.Img} source={require("../../static/course/sign_activate.png")} /> :
                    <Image style={ItemStyle.Img} source={require("../../static/course/sign_failed.png")} />
                }
                <Column style={ItemStyle.Right}>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={{ alignSelf: "flex-start", fontSize: rpx(33), color: signOk ? Color.Primary : Color.Danger }}>2231312321{value.item.sign.name}</Text>
                  <Text style={{ alignSelf: "flex-end", color: Color.Primary }}>{value.item.sign.teacher.name}</Text>
                  <Text style={{ alignSelf: "flex-end", color: Color.Danger }}>{value.item.sign.course.name}</Text>
                  <Text style={{ alignSelf: "flex-end", color: Color.Success }}>{ value.item.sign.type }</Text>
                  <Text style={{ alignSelf: "flex-end", color: Color.Default }}>{value.item.sign.start} -- {value.item.sign.end}</Text>
                </Column>
              </Row>
            </TouchableOpacity>
          )
        }}
      />
    </ContainerBox>
  );
}

const mapStateToProps = (state: RootStoreRedux, ownProps: StackScreenProps<"SignScreen">): ReduxProps => {
  return {
    useAppUserRedux: state.useAppUserRedux,
    useWebSocketRedux: state.useWebSocketRedux
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ReduxDispatch => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignScreen);