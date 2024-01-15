import React from 'react';
import { MainNavigator } from './MM_APP/navigator/Navigator';
import { Provider } from 'react-redux';
import store from "./MM_APP/store";

function App(): React.JSX.Element {
  
  return (
    <Provider store={store}>
      <MainNavigator/>
    </Provider>
  );
}

export default App;
