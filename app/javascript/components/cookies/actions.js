import { createAction, createThunkAction } from 'redux-tools';

export const setCookiesBannerClosed = createAction('setCookiesBannerClosed');

export const agreeCookies = createThunkAction(
  'agreeCookies',
  () => dispatch => {
    localStorage.setItem('agreeCookies', true);
    dispatch(setCookiesBannerClosed(true));
  }
);
