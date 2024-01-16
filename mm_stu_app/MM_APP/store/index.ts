import { combineReducers, legacy_createStore } from "redux";
import { UserReduxProps, useUserRedux } from "./useUserRedux";
import { TestReduxProps, useTestRedux } from './useTestRedux'
import { AppUserReduxProps, useAppUserRedux } from "./useAppUserRedux";

export interface RootStoreRedux {
  useUserRedux: UserReduxProps;
  useTestRedux: TestReduxProps;
  useAppUserRedux: AppUserReduxProps;
}

const Store = combineReducers({
  useUserRedux,
  useTestRedux,
  useAppUserRedux
})

export default legacy_createStore(Store);