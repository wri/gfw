import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { handleActionTrack } from 'utils/analytics';
import { reducer as formReducer } from 'redux-form';

import reducerRegistry from './registry';
import router from './router';
import reducers from './reducers';

// register fixed reducers
reducerRegistry.register('location', router.reducer);
reducerRegistry.register('form', formReducer);

// register non code split reducers
Object.entries(reducers).map(([name, reducer]) =>
  reducerRegistry.register(name, reducer)
);

const initialReducers = combineReducers(reducerRegistry.getReducers());

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [handleActionTrack, thunk, router.middleware];

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
