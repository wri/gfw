import React from 'react';
import { Provider } from 'react-redux';

import 'styles/styles.scss';

import Page from './page';
import store from './store';

const Map = () => (
  <Provider store={store}>
    <Page />
  </Provider>
);

export default Map;
