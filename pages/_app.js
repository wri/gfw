/* eslint-disable react/prop-types */
import React from 'react';
import finallyShim from 'promise.prototype.finally';
import { wrapper } from 'app/store';

import MyGfwProvider from 'providers/mygfw-provider';

import 'styles/styles.scss';

finallyShim.shim();

const App = ({ Component, pageProps }) => {
  return (
    <>
      <MyGfwProvider />
      <Component {...pageProps} />
    </>
  );
};

export default wrapper.withRedux(App);
