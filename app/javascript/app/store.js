import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { handleActionTrack } from 'utils/analytics';

import reducers from './reducers';
import router from './router';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [handleActionTrack, thunk, router.middleware];

const configureStore = () => {
  const store = createStore(
    reducers,
    composeEnhancers(router.enhancer, applyMiddleware(...middlewares))
  );

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./reducers', () => {
        store.replaceReducer(reducers);
      });
    }
  }

  return store;
};

export default configureStore;
