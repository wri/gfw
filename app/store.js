import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { reduxModule as myGfwReduxModule } from 'providers/mygfw-provider';
import reducerRegistry from './registry';

reducerRegistry.registerModule('myGfw', myGfwReduxModule);

const initialReducers = combineReducers(reducerRegistry.getReducers());

/**
 * @param {object} initialState
 * @param {boolean} options.isServer indicates whether it is a server side or client side
 * @param {Request} options.req NodeJS Request object (not set when client applies initialState from server)
 * @param {Request} options.res NodeJS Request object (not set when client applies initialState from server)
 * @param {boolean} options.debug User-defined debug mode param
 * @param {string} options.storeKey This key will be used to preserve store in global namespace for safe HMR
 */

export default (initialState) => {
  return createStore(
    initialReducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
};
