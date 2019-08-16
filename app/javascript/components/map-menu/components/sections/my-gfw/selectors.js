import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import flatMap from 'lodash/flatMap';
import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';

import { getUserAreas } from 'providers/areas-provider/selectors';

const selectLoading = state => state.mapMenu && state.mapMenu.loading;
const selectLoggedIn = state => state.myGfw && !isEmpty(state.myGfw.data);
const selectLocation = state => state.location && state.location.payload;

export const getActiveArea = createSelector(
  [selectLocation, getUserAreas],
  (location, areas) => {
    if (isEmpty(areas)) return null;

    return areas.find(a => a.id === location.adm0);
  }
);

export const getTags = createSelector([getUserAreas], areas => {
  if (isEmpty(areas)) return null;

  return sortBy(
    uniq(flatMap(areas.map(area => area.tags))).map(t => ({
      label: t.length > 15 ? t.substring(0, 15).concat('...') : t,
      value: t
    })),
    'label'
  );
});

export const mapStateToProps = createStructuredSelector({
  loading: selectLoading,
  loggedIn: selectLoggedIn,
  location: selectLocation,
  areas: getUserAreas,
  tags: getTags,
  activeArea: getActiveArea
});
