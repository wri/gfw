/* eslint-disable react/prop-types */
import React from 'react';
import finallyShim from 'promise.prototype.finally';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import useStore from 'redux/store';
import { rootReducer } from 'fast-redux';
import isEmpty from 'lodash/isEmpty';
import useDeepCompareEffect from 'use-deep-compare-effect';

import reducerRegistry from 'redux/registry';

import 'styles/styles.scss';

finallyShim.shim();

const App = ({ Component, pageProps }) => {
  const store = useStore();
  const reducers = reducerRegistry.getReducers();

  useDeepCompareEffect(() => {
    store.replaceReducer(
      isEmpty(reducers)
        ? rootReducer
        : combineReducers(reducerRegistry.getReducers())
    );
  }, [reducers]);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
