import { createSelector, createStructuredSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import isEmpty from 'lodash/isEmpty';
import flatMap from 'lodash/flatMap';
import uniq from 'lodash/uniq';

export const selectAreaLoading = state => state.areas && state.areas.loading;
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

export const getActiveArea = createSelector(
  [selectLocation, getAllAreas],
  (location, areas) => {
    if (isEmpty(areas)) return null;

    return areas.find(
      a => a.id === location.adm0 || a.subscriptionId === location.adm0
    );
  }
);

export const getAreaTags = createSelector([getUserAreas], areas => {
  if (isEmpty(areas)) return null;

  return sortBy(
    uniq(flatMap(areas.map(area => area.tags))).map(t => ({
      label: t && t.length > 15 ? t.substring(0, 15).concat('...') : t,
      value: t
    })),
    'label'
  ).filter(t => t.value && t.label);
});

export const getAreasProps = createStructuredSelector({
  areas: getAllAreas,
  loading: selectAreaLoading,
  loggedIn: selectLoggedIn,
  location: selectLocation
});
