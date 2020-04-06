import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';

import {
  getUserAreas,
  getActiveArea,
  getAreaTags
} from 'providers/areas-provider/selectors';

const PENDING_STATUS = 'pending';

const isNewArea = area => area.status === PENDING_STATUS;

const selectLoading = state =>
  state.areas && state.myGfw && (state.areas.loading || state.myGfw.loading);
const selectLoggedIn = state => state.myGfw && !isEmpty(state.myGfw.data);
const selectLocation = state => state.location && state.location.payload;
const selectUserData = state => state.myGfw && state.myGfw.data;

export const getUserAreasPendingOnTop = createSelector(
  [getUserAreas],
  areas => {
    if (!areas) return null;

    const newAreas = areas.filter(area => isNewArea(area));
    return [
      ...sortBy(newAreas, 'createdAt').reverse(),
      ...areas.filter(area => !isNewArea(area))
    ];
  }
);

export const mapStateToProps = createStructuredSelector({
  loading: selectLoading,
  loggedIn: selectLoggedIn,
  location: selectLocation,
  areas: getUserAreasPendingOnTop,
  tags: getAreaTags,
  activeArea: getActiveArea,
  userData: selectUserData
});
