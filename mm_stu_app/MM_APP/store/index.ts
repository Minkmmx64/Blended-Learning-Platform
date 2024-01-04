import { combineReducers, legacy_createStore } from "redux";
import { UserReduxProps, useUserRedux } from "./useUserRedux";
import { TestReduxProps, useTestRedux } from './useTestRedux'

export interface RootStoreRedux {
  useUserRedux: UserReduxProps;
  useTestRedux: TestReduxProps;
}

const Store = combineReducers({
  useUserRedux,
  useTestRedux
})

export default legacy_createStore(Store);