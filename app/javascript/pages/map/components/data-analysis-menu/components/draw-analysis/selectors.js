import { createStructuredSelector } from 'reselect';

const selectLocation = state => state.location && state.location.payload;
const selectQuery = state => state.location && state.location.query;
const selectData = state => state.analysis.data;

export const getDrawAnalysisProps = createStructuredSelector({
  location: selectLocation,
  query: selectQuery,
  data: selectData
});
