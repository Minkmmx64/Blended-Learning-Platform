import React from 'react';
import { MainNavigator } from './MM_APP/navigator/Navigator';
import { Provider } from 'react-redux';
import DefaultStore from "./MM_APP/store";
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from './MM_APP/compoment/display/toast/ToastContainer';

const { store, persistor } = DefaultStore(); 
function App(): React.JSX.Element {
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={ persistor }>
        <ToastContainer>
          <MainNavigator/>
        </ToastContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
