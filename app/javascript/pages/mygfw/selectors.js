import { createSelector, createStructuredSelector } from 'reselect';

// get list data
const selectAreas = state => state.areas && state.areas.data;
const selectAreasLoading = state => state.areas && state.areas.loading;
const selectMyGfwLoading = state => state.myGfw && state.myGfw.loading;

const getLoading = createSelector(
  [selectAreasLoading, selectMyGfwLoading],
  (areasLoading, myGfwLoading) => areasLoading || myGfwLoading
);

export const getMyGFWProps = createStructuredSelector({
  areas: selectAreas,
  loading: getLoading
});
