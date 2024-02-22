import React, { useEffect } from 'react';
import { MainNavigator } from './MM_APP/navigator/Navigator';
import { Provider } from 'react-redux';
import DefaultStore from "./MM_APP/store";
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from './MM_APP/compoment/display/toast/ToastContainer';
import JPushModule from 'jpush-react-native';
import { requestNotificationPermission } from './MM_APP/utils/permission';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DevicesId } from './MM_APP/const/value';

const { store, persistor } = DefaultStore();
function App(): React.JSX.Element {

  useEffect(() => {
    // 初始化 JPush 模块
    JPushModule.init({
      appKey: "f6fed4a0c36a707509baab3d",
      channel: "developer-default",
      production: false
    });

    //查看是否开启通知权限
    JPushModule.isNotificationEnabled( enabled => {
      if(!enabled) requestNotificationPermission();
    });

    // 监听收到推送事件
    JPushModule.addNotificationListener((map) => {
      console.log('Received notification: ', map);
    });

    JPushModule.getRegistrationID( ({ registerID }) => {
      if(registerID) AsyncStorage.setItem(DevicesId, registerID);
    })

  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer>
          <MainNavigator />
        </ToastContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
