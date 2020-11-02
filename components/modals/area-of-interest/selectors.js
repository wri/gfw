import { createSelector, createStructuredSelector } from 'reselect';

import { getAllAreas } from 'providers/areas-provider/selectors';

const selectAreasLoading = (state) => state.areas && state.areas?.loading;
const selectMyGfwLoading = (state) => state.areas && state.myGfw?.loading;
const selectUserData = (state) => state.myGfw && state.myGfw?.data;

const getLoading = createSelector(
  [selectAreasLoading, selectMyGfwLoading],
  (areasLoading, myGfwLoading) => areasLoading || myGfwLoading
);

export const getAOIModalProps = createStructuredSelector({
  loading: getLoading,
  userData: selectUserData,
  areas: getAllAreas,
});
