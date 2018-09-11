import 'babel-polyfill';

import React from 'react';
import { Provider } from 'react-redux';

import Map from './map';

import configureStore from './store';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <Map />
  </Provider>
);

export default App;
