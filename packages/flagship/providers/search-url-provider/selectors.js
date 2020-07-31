import { createSelector, createStructuredSelector } from 'reselect';

export const selectSearchQuery = (state) => state.search?.query;

export const getUrlParams = createSelector([selectSearchQuery], (query) => ({
  query,
}));

export default createStructuredSelector({
  urlParams: getUrlParams,
});
