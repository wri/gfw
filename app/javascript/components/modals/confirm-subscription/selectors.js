import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { getAllAreas } from 'providers/areas-provider/selectors';

const selectModalOpen = (state) => state.confirmSubscription?.open;
const selectAreaOfInterest = (state) => state.confirmSubscription?.activeAreaId;
const selectLocation = (state) => state.location && state.location.payload;

export const getActiveArea = createSelector(
  [selectLocation, selectAreaOfInterest, getAllAreas],
  (location, areaId, areas) => {
    if (isEmpty(areas)) return null;
    let activeAreaId = '';
    if (location.type === 'aoi') {
      activeAreaId = location.adm0;
    } else {
      activeAreaId = areaId;
    }
    return areas.find((a) => a.id === activeAreaId);
  }
);

export const getConfirmSubscriptionModalProps = createStructuredSelector({
  activeArea: getActiveArea,
  open: selectModalOpen,
});
