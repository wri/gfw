import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { getAllAreas } from 'providers/areas-provider/selectors';

const selectAreaOfInterestModalState = state =>
  state.location &&
  state.location.query &&
  state.location.query.areaOfInterestModal;
const selectLoading = state => state.areas && state.areas.loading;
const selectLoggedIn = state =>
  state.myGfw && state.myGfw.data && state.myGfw.data.loggedIn;
const selectLocation = state => state.location && state.location.payload;

export const getAOIModalOpen = createSelector(
  [selectAreaOfInterestModalState],
  urlState => urlState && urlState.open
);

export const getActiveArea = createSelector(
  [selectLocation, selectAreaOfInterestModalState, getAllAreas],
  (location, settings, areas) => {
    if (isEmpty(areas)) return null;
    let activeAreaId = '';
    if (location.type === 'aoi') {
      activeAreaId = location.adm0;
    } else {
      activeAreaId = settings && settings.activeAreaId;
    }
    return areas.find(a => a.id === activeAreaId);
  }
);

export const getAOIModalProps = createStructuredSelector({
  loading: selectLoading,
  loggedIn: selectLoggedIn,
  activeArea: getActiveArea,
  open: getAOIModalOpen
});
