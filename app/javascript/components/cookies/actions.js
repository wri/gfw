import { createAction, createThunkAction } from 'utils/redux';

export const setCookiesBannerClosed = createAction('setCookiesBannerClosed');

export const agreeCookies = createThunkAction(
  'agreeCookies',
  () => dispatch => {
    localStorage.setItem('agreeCookies', true);
    dispatch(setCookiesBannerClosed());
  }
);
