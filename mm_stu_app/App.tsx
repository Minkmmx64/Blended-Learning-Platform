import React, { useEffect } from 'react';
import { MainNavigator } from './MM_APP/navigator/Navigator';
import { Provider } from 'react-redux';
import DefaultStore from "./MM_APP/store";
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from './MM_APP/compoment/display/toast/ToastContainer';
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";

import JPushModule from 'jpush-react-native';
import { isAndroid } from './MM_APP/utils/common';


const { store, persistor } = DefaultStore();
function App(): React.JSX.Element {

  useEffect(() => {
    // 初始化 JPush 模块
    JPushModule.init({
      appKey: "f6fed4a0c36a707509baab3d",
      channel: "developer-default",
      production: false
    });

    // 监听收到推送事件
    JPushModule.addNotificationListener((map) => {
      console.log('Received notification: ', map);
    });

    requestNotificationPermission();
  })

  const requestNotificationPermission = async () => {
    try {
      const result = await request(
        isAndroid()
          ? PERMISSIONS.ANDROID.POST_NOTIFICATIONS
          : PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY
      );
      if (result === RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting notification permission: ', error);
    }
  };

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
