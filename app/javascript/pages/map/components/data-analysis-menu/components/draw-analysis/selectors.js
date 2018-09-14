import { createStructuredSelector } from 'reselect';

const selectLocation = state => state.location && state.location.payload;
const selectLoading = state =>
  state.analysis.loading || state.datasets.loading || state.geostore.loading;
const selectQuery = state => state.location && state.location.query;
const selectData = state => state.analysis.data;

export const getDrawAnalysisProps = createStructuredSelector({
  location: selectLocation,
  query: selectQuery,
  data: selectData,
  loading: selectLoading
});
