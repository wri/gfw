import { useMemo } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from 'fast-redux';

const createStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        immutableCheck: {
          warnAfter: 80,
        },
        serializableCheck: {
          warnAfter: 80,
        },
      }),
  });

const makeStore = () => useMemo(() => createStore(), []);

export default makeStore;
