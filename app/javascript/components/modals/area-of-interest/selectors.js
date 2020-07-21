import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { getAllAreas } from 'providers/areas-provider/selectors';

const selectModalOpen = (state) => state.areaOfInterestModal?.open;
const selectAreaOfInterestModal = (state) =>
  state.areaOfInterestModal?.activeAreaId;
const selectLoading = (state) => state.areas && state.areas?.loading;
const selectUserData = (state) => state.myGfw && state.myGfw?.data;
const selectLocation = (state) => state.location && state.location?.payload;

export const getActiveArea = createSelector(
  [selectLocation, selectAreaOfInterestModal, getAllAreas],
  (location, areaId, areas) => {
    if (isEmpty(areas)) return null;
    let activeAreaId = areaId;
    if (location.type === 'aoi') {
      activeAreaId = location.adm0;
    }

    return areas.find((a) => a.id === activeAreaId);
  }
);

export const getAOIModalProps = createStructuredSelector({
  loading: selectLoading,
  userData: selectUserData,
  activeArea: getActiveArea,
  open: selectModalOpen,
});
