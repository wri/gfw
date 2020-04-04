import { createStructuredSelector } from 'reselect';

const selectSearchData = (state) => state?.search?.data;
const selectSearchLoading = (state) => state?.search?.loading;
const selectQuery = (state, props) => props?.router?.query?.query;

export default createStructuredSelector({
  data: selectSearchData,
  loading: selectSearchLoading,
  query: selectQuery,
});
