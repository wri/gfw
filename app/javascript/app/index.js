import 'babel-polyfill';

// babel -> core-js shims that aren't yet fully supported
import 'core-js/modules/es7.promise.finally'; // eslint-disable-line import/no-extraneous-dependencies
import 'core-js/modules/es7.promise.try'; // eslint-disable-line import/no-extraneous-dependencies

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
