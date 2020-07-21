import { createSelector, createStructuredSelector } from 'reselect';

const isServer = typeof window === 'undefined';

const selectLoggedIn = (state) =>
  state.myGfw && state.myGfw.data && state.myGfw.data.loggedIn;
const selectLoggingIn = (state) => state.myGfw && state.myGfw.loading;
const selectQuery = (state) => state.location && state.location.query;
export const selectActiveLang = (state) =>
  (!isServer &&
    ((state.location &&
      state.location &&
      state.location.query &&
      state.location.query.lang) ||
      JSON.parse(localStorage.getItem('txlive:selectedlang')))) ||
  'en';

export const getIsGFW = createSelector(
  selectQuery,
  (query) => query && query.gfw && JSON.parse(query.gfw)
);

export const getIsTrase = createSelector(
  selectQuery,
  (query) => query && query.trase && JSON.parse(query.trase)
);

export const getPageProps = createStructuredSelector({
  loggedIn: selectLoggedIn,
  authenticating: selectLoggingIn,
  isGFW: getIsGFW,
  isTrase: getIsTrase,
});
