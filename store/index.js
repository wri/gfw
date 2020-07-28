import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { reduxModule as myGfwReduxModule } from 'providers/mygfw-provider';

import reducerRegistry from './registry';

reducerRegistry.registerModule('myGfw', myGfwReduxModule);

const initialReducers = combineReducers(reducerRegistry.getReducers());

const useStore = (initialState) => {
  const store = createStore(
    initialReducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
  reducerRegistry.setChangeListener((asyncReducers) =>
    store.replaceReducer(combineReducers(asyncReducers))
  );

  return store;
};

export default useStore;
