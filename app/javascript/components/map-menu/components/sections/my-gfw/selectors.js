import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

const selectLoading = state => state.mapMenu && state.mapMenu.loading;
const selectLoggedIn = state => state.myGfw && !isEmpty(state.myGfw.data);
const selectAreas = state => state.areas && state.areas.data;
const selectLocation = state => state.location && state.location.payload;

export const getActiveArea = createSelector(
  [selectLocation, selectAreas],
  (location, areas) => {
    if (isEmpty(areas)) return null;

    return areas.find(a => a.id === location.adm0);
  }
);

export const mapStateToProps = createStructuredSelector({
  loading: selectLoading,
  loggedIn: selectLoggedIn,
  location: selectLocation,
  areas: selectAreas,
  activeArea: getActiveArea
});
