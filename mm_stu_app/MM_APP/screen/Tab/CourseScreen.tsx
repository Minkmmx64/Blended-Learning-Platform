import { Text } from "react-native";
import { ContainerBox } from "../../compoment/ContainerBox";
import { connect } from "react-redux";
import { RootStoreRedux } from "../../store";
import { TabScreenProps } from "../../navigator";
import { UserReduxProps } from "../../store/useUserRedux";

interface ReduxPropsForIndexScreen {
  useUserRedux: UserReduxProps
}

type CourseScreenProps = TabScreenProps<"CourseScreen"> & ReduxPropsForIndexScreen;

function CourseScreen( { useUserRedux } : CourseScreenProps) {
  return (
    <>
      <ContainerBox>
        <Text>{useUserRedux.name}</Text>
      </ContainerBox>
    </>
  )
}

const mapStateToProps = (state : RootStoreRedux, ownProps : TabScreenProps<"CourseScreen">) => {
  return {
    useUserRedux: state.useUserRedux
  };
};

export default connect(mapStateToProps)(CourseScreen);