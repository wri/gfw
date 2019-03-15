import * as actions from './actions';

const hideCookies = JSON.parse(localStorage.getItem('agreeCookies'));

export const initialState = {
  open: !hideCookies
};

const setCookiesBannerClosed = (state, { payload }) => ({
  ...state,
  open: payload
});

export default {
  [actions.setCookiesBannerClosed]: setCookiesBannerClosed
};
