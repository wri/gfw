import * as actions from './actions';

const isServer = typeof window === 'undefined';

const hideCookies = !isServer && JSON.parse(localStorage.getItem('agreeCookies'));

export const initialState = {
  open: !hideCookies
};

const setCookiesBannerClosed = state => ({
  ...state,
  open: false
});

export default {
  [actions.setCookiesBannerClosed]: setCookiesBannerClosed
};
