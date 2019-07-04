import { createStructuredSelector } from 'reselect';

// get list data
const selectQuery = state =>
  state.location && state.location.query && state.location.query.query;
const selectSearchData = state => state.search && state.search.data;
const selectSearchLoading = state => state.search && state.search.loading;

export const getSearchProps = createStructuredSelector({
  query: selectQuery,
  data: selectSearchData,
  loading: selectSearchLoading
});
