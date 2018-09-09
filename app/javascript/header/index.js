import 'babel-polyfill';

import React from 'react';
import { Provider } from 'react-redux';

import Header from './wrapper';

import configureStore from './store';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <Header />
  </Provider>
);

export default App;
