import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';
import router from './router';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [thunk, router.middleware];

const configureStore = () => {
  const store = createStore(
    reducers,
    composeEnhancers(router.enhancer, applyMiddleware(...middlewares))
  );

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./reducers', () => {
        /* eslint-disable global-require */
        const nextRootReducer = require('./reducers');
        store.replaceReducer(nextRootReducer);
      });
    }
  }

  return store;
};

export default configureStore;
