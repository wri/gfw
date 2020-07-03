import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { getAllAreas } from 'providers/areas-provider/selectors';

const selectConfirmSubscriptionModalState = state =>
  state.location &&
  state.location.query &&
  state.location.query.confirmSubscription;
const selectLocation = state => state.location && state.location.payload;

export const getAOIModalOpen = createSelector(
  [selectConfirmSubscriptionModalState],
  urlState => urlState && urlState.open
);

export const getActiveArea = createSelector(
  [selectLocation, selectConfirmSubscriptionModalState, getAllAreas],
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

export const getConfirmSubscriptionModalProps = createStructuredSelector({
  activeArea: getActiveArea,
  open: getAOIModalOpen
});
