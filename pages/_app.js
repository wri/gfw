/* eslint-disable react/prop-types */
import React from 'react';
import finallyShim from 'promise.prototype.finally';
import { Provider } from 'react-redux';
import useStore from 'redux/store';

import 'styles/styles.scss';

finallyShim.shim();

const App = ({ Component, pageProps }) => (
  <Provider store={useStore()}>
    <Component {...pageProps} />
  </Provider>
);

export default App;
