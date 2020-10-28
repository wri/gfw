import { useEffect, useMemo } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { rootReducer } from 'fast-redux';
import { handleActions } from 'redux-actions';

import { useStore } from 'react-redux';

// Configure the store
const createStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    devTools: true,
  });

  // Add a dictionary to keep track of the registered async reducers
  store.asyncReducers = {};

  // Create an inject reducer function
  // This function adds the async reducer, and creates a new combined reducer
  store.injectReducer = ({ key, reducers, initialState }) => {
    if (!store.asyncReducers[`${key}`]) {
      store.asyncReducers[`${key}`] = handleActions(reducers, initialState);
      store.replaceReducer(combineReducers(store.asyncReducers));
    }
  };

  // Return the modified store
  return store;
};

export const registerReducer = (
  reduxModule = {
    key: '',
    reducers: {},
    initialState: {},
  }
) => {
  const { injectReducer } = useStore();
  useEffect(() => {
    injectReducer(reduxModule);
  }, []);
};

const makeStore = (initialState) =>
  useMemo(() => createStore(initialState), [initialState]);

export default makeStore;
