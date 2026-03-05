/**
 * Mock for Next.js router
 * This should be used in jest.mock() calls
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

export const mockUseRouter = (routerProps = {}) => {
  return createMockRouter(routerProps);
};

export default {
  createMockRouter,
  mockUseRouter,
};
