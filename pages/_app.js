/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import finallyShim from 'promise.prototype.finally';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import useStore from 'redux/store';
import { rootReducer } from 'fast-redux';
import isEmpty from 'lodash/isEmpty';

import reducerRegistry from 'redux/registry';

import 'styles/styles.scss';

finallyShim.shim();

const App = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialReduxState);

  useMemo(() => {
    const reducers = reducerRegistry.getReducers();
    store.replaceReducer(
      isEmpty(reducers)
        ? rootReducer
        : combineReducers(reducerRegistry.getReducers())
    );
  });

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
