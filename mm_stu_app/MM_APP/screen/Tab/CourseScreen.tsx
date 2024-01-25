import { ContainerBox } from "../../compoment/ContainerBox";
import { TabScreenProps } from "../../navigator";
import { RootStoreRedux } from "../../store";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { AppUserReduxProps } from "../../store/useAppUserRedux";
import { Text } from "react-native";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { useCheckUserLoginOnTabPress } from "../../hooks/useCheckUserLogin";

interface ReduxProps {
  useAppUserRedux : AppUserReduxProps
}

interface ReduxDispatch {

}

type CourseScreenProps = TabScreenProps<"CourseScreen"> & ReduxProps & BottomTabNavigationOptions;

function CourseScreen( { navigation, useAppUserRedux } : CourseScreenProps) {

  useCheckUserLoginOnTabPress(
    navigation, 
    useAppUserRedux,  
    [ useAppUserRedux ]
  );

  return (
    <>
      <ContainerBox>
        <Text>{ useAppUserRedux.username }</Text>
      </ContainerBox>
    </>
  )
}

const mapStateToProps = (state : RootStoreRedux, ownProps : TabScreenProps<"CourseScreen">): ReduxProps => {
  return {
    useAppUserRedux: state.useAppUserRedux,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ReduxDispatch => {
  return {
    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseScreen);