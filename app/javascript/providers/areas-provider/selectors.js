import { createSelector, createStructuredSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import isEmpty from 'lodash/isEmpty';

export const selectLoading = state => state.areas && state.areas.loading;
export const selectLocation = state =>
  state && state.location && state.location.payload;
export const selectLoggedIn = state =>
  state && !!state.myGfw && !isEmpty(state.myGfw.data);

export const getAllAreas = state =>
  state && state.areas && sortBy(state.areas.data, 'name');

export const getUserAreas = createSelector(
  [getAllAreas],
  areas => (areas && areas.filter(area => area.userArea)) || null
);

export const getAreasProps = createStructuredSelector({
  areas: getAllAreas,
  loading: selectLoading,
  loggedIn: selectLoggedIn,
  location: selectLocation
});
