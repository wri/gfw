import { createStructuredSelector } from 'reselect';

const selectAreasLoading = state => state.areas && state.areas.loading;

export const getMyGFWProps = createStructuredSelector({
  loading: selectAreasLoading
});
