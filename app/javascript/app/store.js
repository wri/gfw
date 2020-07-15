import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createWrapper } from 'next-redux-wrapper';

import reducerRegistry from './registry';

const isServer = typeof window === 'undefined';

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

/**
 * @param {object} initialState
 * @param {boolean} options.isServer indicates whether it is a server side or client side
 * @param {Request} options.req NodeJS Request object (not set when client applies initialState from server)
 * @param {Request} options.res NodeJS Request object (not set when client applies initialState from server)
 * @param {boolean} options.debug User-defined debug mode param
 * @param {string} options.storeKey This key will be used to preserve store in global namespace for safe HMR
 */

export const initStore = (initialState) => {
  const initialReducers = combineReducers({
    ...reducerRegistry.getReducers(),
  });

  return createStore(
    initialReducers,
    initialState,
    composeEnhancers(applyMiddleware(thunkMiddleware))
  );
};

export const wrapper = createWrapper(initStore);
