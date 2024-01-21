import React from 'react';
import { MainNavigator } from './MM_APP/navigator/Navigator';
import { Provider } from 'react-redux';
import DefaultStore from "./MM_APP/store";
import { PersistGate } from 'redux-persist/integration/react'

const { store, persistor } = DefaultStore(); 
function App(): React.JSX.Element {
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={ persistor }>
        <MainNavigator/>
      </PersistGate>
    </Provider>
  );
}

export default App;
