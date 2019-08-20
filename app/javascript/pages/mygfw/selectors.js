import { createSelector, createStructuredSelector } from 'reselect';

import { getUserAreas } from 'providers/areas-provider/selectors';

// get list data
const selectAreasLoading = state => state.areas && state.areas.loading;
const selectMyGfwLoading = state => state.myGfw && state.myGfw.loading;

const getLoading = createSelector(
  [selectAreasLoading, selectMyGfwLoading],
  (areasLoading, myGfwLoading) => areasLoading || myGfwLoading
);

export const getMyGFWProps = createStructuredSelector({
  loading: getLoading,
  areas: getUserAreas
});
