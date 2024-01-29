import { Text } from "react-native";
import { ContainerBox } from "../../compoment/ContainerBox";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RootStoreRedux } from "../../store";
import { TabScreenProps } from "../../navigator";
import { AppUserReduxProps } from "../../store/useAppUserRedux";
import { useCheckUserLoginOnTabPress } from "../../hooks/useCheckUserLogin";

interface ReduxProps {
  useAppUserRedux: AppUserReduxProps
}

interface ReduxDispatch {

}

type MessageScreenProps = TabScreenProps<"MessageScreen"> & ReduxProps & ReduxDispatch;


function MessageScreen({ navigation, useAppUserRedux } : MessageScreenProps) {

  useCheckUserLoginOnTabPress(
    navigation, 
    useAppUserRedux, 
    [useAppUserRedux]
  );

  return (
    <>
      <ContainerBox>
        
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