import 'babel-polyfill';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { HelmetProvider } from 'react-helmet-async';

import configureStore from './store';
import Root from './layouts/root';

const { store, persistor } = configureStore();

const App = () => (
  <Provider store={store}>
    <HelmetProvider>
      <PersistGate loading={null} persistor={persistor}>
        <Root />
      </PersistGate>
    </HelmetProvider>
  </Provider>
);

export default App;
