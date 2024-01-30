import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ContainerBox } from "../../compoment/ContainerBox";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { TabScreenProps } from "../../navigator";
import { useCallback, useEffect, useRef } from "react";
import { RootStoreRedux } from "../../store";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { AppUserReduxProps, clearAppUser, setAppUser } from "../../store/useAppUserRedux";
import { rpx } from "../../utils/common";
import { Color } from "../../utils/style";
import { Column } from "../../compoment/flex-box/Column";
import { UtilTools } from "../compoment/UtilTools";
import { AdminUtilToolsDatas } from "../../utils/data";
import { WebSocketReduxProps } from "../../store/useWebSocketRedux";

const DefaultAvatar = "http://124.220.176.205:8080/image/4608aad3b19cb132d58c6f4f55a71163.jpeg";

interface ReduxProps {
  useAppUserRedux: AppUserReduxProps;
  useWebSocketRedux: WebSocketReduxProps;
}

interface ReduxDispatch {
  setUserdata: (data: Partial<AppUserReduxProps>) => void;
  clearAppUser: () => void;
}

type AdminScreenProps = TabScreenProps<"AdminScreen"> & ReduxProps & ReduxDispatch;

function AdminScreen({ navigation, useAppUserRedux, clearAppUser, useWebSocketRedux }: AdminScreenProps) {

  const isFocuse = useIsFocused();

  const AdminBgImgAnimated = useRef(new Animated.Value(0)).current;

  const AvatarPress = () => {
    if (useAppUserRedux.id == -1) {
      //未登录，去登录
      navigation.push("LoginScreen");
    }
  }

  useFocusEffect(useCallback(() => {
    Animated.timing(AdminBgImgAnimated, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
    return () => {
      Animated.timing(AdminBgImgAnimated, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      }).start();
    }
  }, []));

  return (
    <>
      <ContainerBox isFocuse={isFocuse} StatusBarOptions={{
        backgroundColor: "transparent",
      }}>
        <ScrollView style={{ width: rpx(750), height: "100%" }}>
          {/* 背景 */}
          <Animated.Image resizeMethod="scale"
            style={{
              ...AdminStyle.AdminBgImg,
              opacity: AdminBgImgAnimated
            }} source={require("../../static/admin/admin_bg.png")} />
          <Column style={{ marginTop: rpx(260) }}>
            {/* 用户头像 */}
            <TouchableOpacity activeOpacity={0.9} onPress={AvatarPress} >
              <Image style={AdminStyle.AdminAvatar} source={{ uri: useAppUserRedux.avatar ?? DefaultAvatar }} />
            </TouchableOpacity>
            <Text style={{ marginTop: 10 }}>{useAppUserRedux.username ?? "请登录"}</Text>
            {/* 用户功能列表 */}
            <UtilTools
              style={{ width: rpx(700) }}
              data={AdminUtilToolsDatas}
              ItemOnPress={v => {
                console.log(v)
              }}
            />
            <TouchableOpacity
              onPress={() => {
                clearAppUser();
                navigation.push("LoginScreen");
              }}
              activeOpacity={0.8}
              style={{ width: rpx(700), height: rpx(60), borderBottomWidth: 1, borderBottomColor: Color.Primary, bottom: rpx(0) }}>
              <Column style={{ height: rpx(60) }}>
                <Text style={{ color: Color.Danger }}>退出登录</Text>
              </Column>
            </TouchableOpacity>
          </Column>
        </ScrollView>
      </ContainerBox>
    </>
  )
}

const AdminStyle = StyleSheet.create({
  AdminBgImg: {
    position: "absolute",
    top: 0,
  },
  AdminAvatar: {
    borderRadius: rpx(100),
    width: rpx(200),
    height: rpx(200)
  }
})


/**
 * @param state RootStore的Reducer
 * @param ownProps 该组件的Props
 * 该对象会在Props中,也就是state的值会在该组件的参数列表
 */
const mapStateToProps = (state: RootStoreRedux, ownProps: TabScreenProps<"AdminScreen">): ReduxProps => {
  return {
    useAppUserRedux: state.useAppUserRedux,
    useWebSocketRedux: state.useWebSocketRedux
  };
};

/**
 * @param dispatch 
 * 定义dispatch 该组件会包含一个 fetchData 方法 执行 dispatch
 */
const mapDispatchToProps = (dispatch: Dispatch): ReduxDispatch => {
  return {
    setUserdata: (data) => setAppUser(dispatch)(data),
    clearAppUser: () => clearAppUser(dispatch)()
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminScreen);