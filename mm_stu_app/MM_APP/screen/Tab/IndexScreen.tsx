import { Button, Text } from "react-native";
import { ContainerBox } from "../../compoment/ContainerBox";
import { connect } from "react-redux";
import { RootStoreRedux } from "../../store";
import { TabScreenProps } from "../../navigator";
import { TestReduxProps } from "../../store/useTestRedux";
import { Dispatch } from "redux";
import { UserReduxProps } from "../../store/useUserRedux";

interface ReduxPropsForIndexScreen {
  useTestRedux: TestReduxProps
  useUserRedux: UserReduxProps
}

interface ReduxDispatchForIndexScreen {
  fetchData: () => void;
  changeUser: () => void;
}

type IndexScreenProps = TabScreenProps<"IndexScreen"> & ReduxDispatchForIndexScreen & ReduxPropsForIndexScreen;

function IndexScreen({ useTestRedux, fetchData, useUserRedux, changeUser } : IndexScreenProps) {
  return (
    <>
      <ContainerBox>
        <Text>{useTestRedux.test}</Text>
        <Text>{useUserRedux.name}</Text>
        <Button title="ChangeTest" onPress={() => fetchData()} />
        <Button title="ChangeUser" onPress={() => changeUser()} />
      </ContainerBox>
    </>
  )
}

/**
 * @param state RootStore的Reducer
 * @param ownProps 该组件的Props
 * 该对象会在Props中,也就是state的值会在该组件的参数列表
 */
const mapStateToProps = (state : RootStoreRedux, ownProps : TabScreenProps<"IndexScreen">) => {
  return {
    useTestRedux: state.useTestRedux,
    useUserRedux: state.useUserRedux
  };
};

/**
 * @param dispatch 
 * 定义dispatch 该组件会包含一个 fetchData 方法 执行 dispatch
 */
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchData: () => dispatch({type: "TEST"}),
    changeUser: () => dispatch({type: "TEST_USER"})
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IndexScreen);