import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { handleActionTrack } from 'utils/analytics';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducers from './reducers';
import router from './router';

const persistConfig = {
  key: 'root',
  whitelist: ['modalWelcome'],
  storage
};

const persistedReducer = persistReducer(persistConfig, reducers);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [handleActionTrack, thunk, router.middleware];

export default () => {
  const store = createStore(
    persistedReducer,
    composeEnhancers(router.enhancer, applyMiddleware(...middlewares))
  );
  const persistor = persistStore(store);

  return { store, persistor };
};
