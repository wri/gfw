import 'babel-polyfill';

import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './store';
import Root from './layouts/root';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <Root />
  </Provider>
);

export default App;
