import { useMemo } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from 'fast-redux';

const createStore = () =>
  configureStore({
    reducer: rootReducer,
  });

const makeStore = () => useMemo(() => createStore(), []);

export default makeStore;
