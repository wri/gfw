import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';

import reducerRegistry from './registry';
import router from './router';

// register fixed reducers
reducerRegistry.register('location', router.reducer);
reducerRegistry.register('form', formReducer);

const initialReducers = combineReducers(reducerRegistry.getReducers());

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [thunk, router.middleware];

export default () => {
  const store = createStore(
    initialReducers,
    composeEnhancers(router.enhancer, applyMiddleware(...middlewares))
  );
  reducerRegistry.setChangeListener(asyncReducers =>
    store.replaceReducer(combineReducers(asyncReducers))
  );

  return store;
};
