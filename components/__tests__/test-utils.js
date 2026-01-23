import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from 'fast-redux';

/**
 * Creates a mock Redux store for testing
 * @param {Object} initialState - Initial state for the store
 * @param {Object} options - Additional store configuration options
 * @returns {Object} Configured Redux store
 */
export const createMockStore = (initialState = {}, options = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        immutableCheck: false,
        serializableCheck: false,
        ...options.middleware,
      }),
    ...options,
  });
};

/**
 * Renders a component with Redux Provider
 * @param {React.Component} component - Component to render
 * @param {Object} options - Options for rendering
 * @param {Object} options.initialState - Initial Redux state
 * @param {Object} options.store - Custom store (overrides initialState)
 * @param {Object} options.renderOptions - Additional options for render()
 * @returns {Object} Render result and store
 */
export const renderWithRedux = (component, options = {}) => {
  const { initialState = {}, store, ...renderOptions } = options;
  const testStore = store || createMockStore(initialState);

  const Wrapper = ({ children }) => (
    <Provider store={testStore}>{children}</Provider>
  );

  const renderResult = render(component, { wrapper: Wrapper, ...renderOptions });

  return {
    ...renderResult,
    store: testStore,
  };
};

/**
 * Mocks Next.js router for testing
 * @param {Object} routerProps - Router properties to mock
 * @returns {Object} Mocked router object
 */
export const createMockRouter = (routerProps = {}) => {
  return {
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    ...routerProps,
  };
};

/**
 * Renders a component with Next.js router mock
 * @param {React.Component} component - Component to render
 * @param {Object} options - Options for rendering
 * @param {Object} options.routerProps - Router properties to mock
 * @param {Object} options.renderOptions - Additional options for render()
 * @returns {Object} Render result and router mock
 */
export const renderWithRouter = (component, options = {}) => {
  const { routerProps = {}, ...renderOptions } = options;
  const mockRouter = createMockRouter(routerProps);

  // Mock next/router
  jest.mock('next/router', () => ({
    useRouter: () => mockRouter,
  }));

  const renderResult = render(component, renderOptions);

  return {
    ...renderResult,
    router: mockRouter,
  };
};

/**
 * Renders a component with both Redux and Router
 * @param {React.Component} component - Component to render
 * @param {Object} options - Options for rendering
 * @returns {Object} Render result, store, and router
 */
export const renderWithReduxAndRouter = (component, options = {}) => {
  const { initialState = {}, store, routerProps = {}, ...renderOptions } = options;
  const testStore = store || createMockStore(initialState);
  const mockRouter = createMockRouter(routerProps);

  // Mock next/router
  jest.mock('next/router', () => ({
    useRouter: () => mockRouter,
  }));

  const Wrapper = ({ children }) => (
    <Provider store={testStore}>{children}</Provider>
  );

  const renderResult = render(component, { wrapper: Wrapper, ...renderOptions });

  return {
    ...renderResult,
    store: testStore,
    router: mockRouter,
  };
};

/**
 * Common mock data factories for frequently used props
 */
export const mockDataFactories = {
  location: (overrides = {}) => ({
    type: 'country',
    adm0: 'BRA',
    adm1: undefined,
    adm2: undefined,
    label: 'Brazil',
    ...overrides,
  }),

  widget: (overrides = {}) => ({
    widget: 'tree-loss',
    title: 'Tree Loss',
    type: 'chart',
    loading: false,
    error: false,
    data: [],
    ...overrides,
  }),

  dataset: (overrides = {}) => ({
    id: 'test-dataset',
    name: 'Test Dataset',
    visible: true,
    opacity: 1,
    ...overrides,
  }),

  user: (overrides = {}) => ({
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
    authenticated: true,
    ...overrides,
  }),
};

/**
 * Waits for async operations to complete
 * Useful for testing components with async effects
 */
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Creates a mock function that can be used as a prop
 */
export const createMockFunction = (name = 'mockFn') => {
  const fn = jest.fn();
  fn.displayName = name;
  return fn;
};
