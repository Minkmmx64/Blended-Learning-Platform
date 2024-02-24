import { combineReducers, legacy_createStore } from "redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppUserReduxProps, useAppUserRedux } from "./useAppUserRedux";
import { WebSocketReduxProps, useWebSocketRedux } from "./useWebSocketRedux";
import { PersistConfig, createTransform, persistReducer, persistStore } from 'redux-persist';
import { SocketManager } from "../websocket/connect";
//import JPushModule from 'jpush-react-native';

export interface RootStoreRedux {
  useAppUserRedux: AppUserReduxProps;
  useWebSocketRedux: WebSocketReduxProps
}

const Store = combineReducers({
  useAppUserRedux: useAppUserRedux,
  useWebSocketRedux: useWebSocketRedux,
});

//设置存储引擎和key
const persistConfig: PersistConfig<any> = {
  key: 'minkm',
  storage: AsyncStorage,
  transforms: [
    createTransform(
      (input, key) => {
        if(key === "useWebSocketRedux"){
          return { ...input, Socket: null }
        }
        else return { ...input };
      },
      (output, key) => {
        if(key === "useWebSocketRedux")
          if((Object.keys(output.ConnectData).length)) {
            return { ...output, Socket: new SocketManager(output.ConnectData) }
          }else
            return { ...output, Socket: null }
        else {
          if(key === "useAppUserRedux") {
            //console.log(output, key);
            return { ...output };
          } else 
            return { ...output };
        }
      }
    )
  ]
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