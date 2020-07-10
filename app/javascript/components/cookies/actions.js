import { createAction, createThunkAction } from 'utils/redux';

export const setCookiesBannerClosed = createAction('setCookiesBannerClosed');

const isServer = typeof window === 'undefined';

export const agreeCookies = createThunkAction(
  'agreeCookies',
  () => dispatch => {
    if (!isServer) {
      localStorage.setItem('agreeCookies', true);
      dispatch(setCookiesBannerClosed());
    }
  }
);
