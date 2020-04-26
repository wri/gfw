import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';

import {
  getUserAreas,
  getActiveArea,
  getAreaTags,
} from 'providers/areas-provider/selectors';

const selectLoading = (state) => state.areas?.loading || state.myGfw?.loading;
const selectLoggedIn = (state) => state.myGfw && !isEmpty(state.myGfw.data);
const selectLocation = (state) => state.location;
const selectUserData = (state) => state.myGfw?.data;

const getSortedAreas = createSelector(
  getUserAreas,
  (areas) => areas && sortBy(areas, 'createdAt').reverse()
);

export default createStructuredSelector({
  loading: selectLoading,
  loggedIn: selectLoggedIn,
  location: selectLocation,
  areas: getSortedAreas,
  tags: getAreaTags,
  activeArea: getActiveArea,
  userData: selectUserData,
});
