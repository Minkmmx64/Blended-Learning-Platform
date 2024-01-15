import { Action } from "redux";

export interface TestReduxProps {
  test: string;
}

const initializeTestRedux: TestReduxProps = {
  test: "1122"
}

//每个Redux 都依赖action-行为来触发state更新
//在react组件使用时，通过connect(mapStateToProps, mapStateToDispatch) 来为组件添加 dispatch 以及 state 对象
export function useTestRedux(state: TestReduxProps = initializeTestRedux, action: Action) {
  switch(action.type) {
    case "TEST" : {
      return {
        ...state,
        test: "test"
      };
    }
    default:
      return state;
  }
}