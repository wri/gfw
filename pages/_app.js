/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import finallyShim from 'promise.prototype.finally';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import useStore from 'redux/store';
import { rootReducer } from 'fast-redux';
import isEmpty from 'lodash/isEmpty';

import { trackEvent } from 'utils/analytics';
import reducerRegistry from 'redux/registry';

import 'styles/styles.scss';

finallyShim.shim();

// fixes dev mode css modules not being added to the document correctly between
// route changes due to a conflict between mini-css-extract-plugin and HMR
// https://github.com/sheerun/extracted-loader/issues/11#issue-453094382
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.addStatusHandler((status) => {
    if (typeof window !== 'undefined' && status === 'ready') {
      window.__webpack_reload_css__ = true;
    }
  });
}

const App = ({ Component, pageProps }) => {
  const store = useStore();

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

export function reportWebVitals({ id, name, label, value }) {
  trackEvent({
    action: name,
    category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  });
}

export default App;
