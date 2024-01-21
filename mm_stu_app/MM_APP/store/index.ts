import { combineReducers, legacy_createStore } from "redux";
import { AppUserReduxProps, useAppUserRedux } from "./useAppUserRedux";
import { persistReducer, persistStore } from 'redux-persist';
 import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RootStoreRedux {
  useAppUserRedux: AppUserReduxProps;
}

const Store = combineReducers({
  useAppUserRedux
})

//设置存储引擎和key
const persistConfig = {
  key: 'minkm',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, Store);

const store = legacy_createStore(persistedReducer);

const persistor = persistStore(store);

export default () => {
  
  return {
    store: store,
    persistor: persistor
  }
}