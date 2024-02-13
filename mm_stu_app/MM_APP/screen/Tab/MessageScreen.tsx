import { Text } from "react-native";
import { ContainerBox } from "../../compoment/ContainerBox";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RootStoreRedux } from "../../store";
import { RootStackParamList, TabScreenProps } from "../../navigator";
import { AppUserReduxProps } from "../../store/useAppUserRedux";
import { useCheckUserLoginOnTabPress } from "../../hooks/useCheckUserLogin";
import { UtilTools, UtilToolsBaseProps } from "../compoment/UtilTools";
import { Row } from "../../compoment/flex-box/Row";
import { rpx } from "../../utils/common";

interface ReduxProps {
  useAppUserRedux: AppUserReduxProps
}

interface ReduxDispatch {

}

type MessageScreenProps = TabScreenProps<"MessageScreen"> & ReduxProps & ReduxDispatch;

interface IMessageUtilTools extends UtilToolsBaseProps{
  nav: keyof RootStackParamList;
}

function MessageScreen({ navigation, useAppUserRedux } : MessageScreenProps) {

  useCheckUserLoginOnTabPress(
    navigation, 
    useAppUserRedux, 
    [useAppUserRedux]
  );

  return (
    <>
      <ContainerBox>
        <Row>
          <UtilTools
            style={{ paddingLeft: rpx(50) }}
            hiddenRightArrow={ true }
            data={[
              {
                label: "签到消息",
                icon: "http://124.220.176.205:8080/image/bf71a48c8c0b4daefd6b6abc99d377f8.png",
                nav: "SignScreen"
              }
            ] as IMessageUtilTools[]}
            ItemOnPress={ value => { navigation.push(value.nav); }}
          />
        </Row>
      </ContainerBox>
    </>
  )
}

const mapStateToProps = (state : RootStoreRedux, ownProps : TabScreenProps<"MessageScreen">): ReduxProps => {
  return {
    useAppUserRedux: state.useAppUserRedux,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ReduxDispatch => {
  return {
    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageScreen);