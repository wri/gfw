import { createSelector, createStructuredSelector } from 'reselect';

// get list data
const selectAreasLoading = state => state.areas && state.areas.loading;
const selectMyGfwLoading = state => state.myGfw && state.myGfw.loading;
const selectAreas = state =>
  state.areas &&
  state.areas.data &&
  state.areas.data.filter(a => !a.notUserArea);

const getLoading = createSelector(
  [selectAreasLoading, selectMyGfwLoading],
  (areasLoading, myGfwLoading) => areasLoading || myGfwLoading
);

export const getMyGFWProps = createStructuredSelector({
  loading: getLoading,
  areas: selectAreas
});
