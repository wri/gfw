import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { handleActionTrack } from 'utils/analytics';

import 'react-tippy/dist/tippy.css';
import 'styles/styles.scss';

import reducers from './reducers';
import router from './router';

import Root from './root';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = applyMiddleware(
  thunk,
  router.middleware,
  handleActionTrack
);
const store = createStore(
  reducers,
  composeEnhancers(router.enhancer, middlewares)
);

const Map = () => (
  <Provider store={store}>
    <Root />
  </Provider>
);

export default Map;
