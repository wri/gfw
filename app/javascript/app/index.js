import 'babel-polyfill';
import React from 'react';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

import configureStore from './store';
import Root from './layouts/root';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <HelmetProvider>
      <Root />
    </HelmetProvider>
  </Provider>
);

export default App;
