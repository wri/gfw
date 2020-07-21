import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { reduxModule as myGfwReduxModule } from 'providers/mygfw-provider';

import reducerRegistry from './registry';

const isServer = typeof window === 'undefined';

reducerRegistry.registerModule('myGfw', myGfwReduxModule);

const initialReducers = combineReducers(reducerRegistry.getReducers());

const reduxDevTools =
  !isServer &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    maxAge: 10,
    stateSanitizer: (state) => ({
      ...state,
      datasets: {
        ...state.datasets,
        data: 'NOT_SERIALIZED',
      },
      ptw: {
        ...state.ptw,
        data: 'NOT_SERIALIZED',
      },
      countryData: {
        ...state.countryData,
        countries: 'NOT_SERIALIZED',
        gadmCountries: 'NOT_SERIALIZED',
        faoCountries: 'NOT_SERIALIZED',
      },
    }),
  });

const composeEnhancers =
  (process.env.NODE_ENV === 'development' && reduxDevTools) || compose;

export default (initialState) => {
  const store = createStore(
    initialReducers,
    initialState,
    composeEnhancers(applyMiddleware(thunkMiddleware))
  );
  reducerRegistry.setChangeListener((asyncReducers) =>
    store.replaceReducer(combineReducers(asyncReducers))
  );

  return store;
};
