import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { getAllAreas } from 'providers/areas-provider/selectors';

const selectActiveAreaId = (state) => state?.areaModal?.activeAreaId;
const selectAreaModalOpen = (state) => state?.areaModal?.open;
const selectLoading = (state) => state?.areas?.loading;
const selectUserData = (state) => state?.myGfw?.data;
const selectLocation = (state) => state.location;

export const getActiveArea = createSelector(
  [selectLocation, selectActiveAreaId, getAllAreas],
  (location, areaId, areas) => {
    if (isEmpty(areas)) return null;
    let activeAreaId = '';
    if (location?.type === 'aoi') {
      activeAreaId = location?.adm0;
    } else {
      activeAreaId = areaId;
    }
    return areas.find((a) => a.id === activeAreaId);
  }
);

export const getAOIModalProps = createStructuredSelector({
  loading: selectLoading,
  userData: selectUserData,
  activeArea: getActiveArea,
  open: selectAreaModalOpen,
});
