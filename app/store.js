import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// import reduxQuerySync from 'utils/stateToUrl';

import { reduxModule as myGfwReduxModule } from 'providers/mygfw-provider';
import locationReduxModule from 'providers/location-provider';

import reducerRegistry from './registry';

reducerRegistry.registerModule('myGfw', myGfwReduxModule);
reducerRegistry.registerModule('location', locationReduxModule);

const initialReducers = combineReducers(reducerRegistry.getReducers());

/**
 * @param {object} initialState
 * @param {boolean} options.isServer indicates whether it is a server side or client side
 * @param {Request} options.req NodeJS Request object (not set when client applies initialState from server)
 * @param {Request} options.res NodeJS Request object (not set when client applies initialState from server)
 * @param {boolean} options.debug User-defined debug mode param
 * @param {string} options.storeKey This key will be used to preserve store in global namespace for safe HMR
 */

// action sync to url
// push changes path and query -> set query to store, location to store
// back in history set url state to store
// path change with query change -> set path and then set query change also (compare)

export default (initialState) => {
  const store = createStore(
    initialReducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );

  // reduxQuerySync({
  //   store,
  //   params: {
  //     map: {
  //       key: 'map',
  //       actionName: 'setMapSettings',
  //       selector: state => state?.map?.settings,
  //       action: payload => ({ type: 'setMapSettings', payload })
  //     },
  //     mainMap: {
  //       key: 'mainMap',
  //       actionName: 'setMainMapSettings',
  //       selector: state => state?.mainMap,
  //       action: payload => ({ type: 'setMainMapSettings', payload })
  //     },
  //     menu: {
  //       key: 'menu',
  //       actionName: 'setMenuSettings',
  //       selector: state => state?.mapMenu,
  //       action: payload => ({ type: 'setMenuSettings', payload })
  //     },
  //   }
  // })

  return store;
};
