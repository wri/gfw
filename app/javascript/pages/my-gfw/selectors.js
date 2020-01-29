import { createStructuredSelector } from 'reselect';

const selectAreasLoading = state => state.areas && state.areas.loading;
const selectAreas = state => state.areas && state.areas.data;

export const getMyGFWProps = createStructuredSelector({
  loading: selectAreasLoading,
  areas: selectAreas
});
