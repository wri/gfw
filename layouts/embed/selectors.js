import { createSelector, createStructuredSelector } from 'reselect';

const selectQuery = (state) => state.location && state.location.query;

export const getIsGFW = createSelector(
  selectQuery,
  (query) => query && query.gfw && JSON.parse(query.gfw)
);

export const getIsTrase = createSelector(
  selectQuery,
  (query) => query && query.trase && JSON.parse(query.trase)
);

export const getPageProps = createStructuredSelector({
  isGFW: getIsGFW,
  isTrase: getIsTrase,
});
