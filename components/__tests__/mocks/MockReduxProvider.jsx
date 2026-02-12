import React from 'react';
import { Provider } from 'react-redux';
import { createMockStore } from '../test-utils';

/**
 * Mock Redux Provider component for testing
 * Can be used directly in tests or as a wrapper
 */
export const MockReduxProvider = ({ children, initialState = {}, store }) => {
  const testStore = store || createMockStore(initialState);

  return <Provider store={testStore}>{children}</Provider>;
};

export default MockReduxProvider;
