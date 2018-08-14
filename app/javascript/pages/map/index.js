import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { hot } from 'react-hot-loader';

import 'react-tippy/dist/tippy.css';
import 'styles/styles.scss';

import reducers from './reducers';
import router from './router';

import Page from './page';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = applyMiddleware(thunk, router.middleware);
const store = createStore(
  reducers,
  composeEnhancers(router.enhancer, middlewares)
);

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    // eslint-disable-next-line global-require
    const nextRootReducer = require('./reducers');
    store.replaceReducer(nextRootReducer);
  });
}

const Map = () => (
  <Provider store={store}>
    <Page />
  </Provider>
);

export default hot(module)(Map);
