/* eslint-disable react/prop-types */
import React from 'react';
import finallyShim from 'promise.prototype.finally';

// Redux
import { Provider } from 'react-redux';
import { useStore } from 'app/store';

// Providers
import MyGfwProvider from 'providers/mygfw-provider';

import 'styles/styles.scss';

finallyShim.shim();

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <MyGfwProvider />
      <Component {...pageProps} />
    </Provider>
  );
}
