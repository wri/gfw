import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';

import { reduxModule as myGfwReduxModule } from 'providers/mygfw-provider';
import reducerRegistry from './registry';
import router from './router';

// register fixed reducers
reducerRegistry.register('location', router.reducer);
reducerRegistry.register('form', formReducer);
reducerRegistry.registerModule('myGfw', myGfwReduxModule);

const initialReducers = combineReducers(reducerRegistry.getReducers());

const reduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    maxAge: 10,
    stateSanitizer: state => ({
      ...state,
      datasets: {
        ...state.datasets,
        data: 'NOT_SERIALIZED'
      },
      ptw: {
        ...state.ptw,
        data: 'NOT_SERIALIZED'
      },
      countryData: {
        ...state.countryData,
        countries: 'NOT_SERIALIZED',
        gadmCountries: 'NOT_SERIALIZED',
        faoCountries: 'NOT_SERIALIZED'
      }
    })
  });

const composeEnhancers =
  (process.env.NODE_ENV === 'development' && reduxDevTools) || compose;
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
