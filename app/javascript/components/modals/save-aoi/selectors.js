import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { getGeodescriberTitleFull } from 'providers/geodescriber-provider/selectors';

import { getAllAreas } from 'providers/areas-provider/selectors';

import { initialState } from './reducers';

const selectSaveAOIUrlState = state =>
  state.location && state.location.query && state.location.query.saveAOI;
const selectLoading = state =>
  (state.datasets && state.datasets.loading) ||
  (state.myGfw && state.myGfw.loading);
const selectSaving = state => state.modalSaveAOI && state.modalSaveAOI.saving;
const selectError = state => state.modalSaveAOI && state.modalSaveAOI.error;
const selectUserData = state => (state.myGfw && state.myGfw.data) || {};
const selectLocation = state => state.location && state.location.payload;

export const getSaveAOISettings = createSelector(
  [selectSaveAOIUrlState],
  urlState => ({
    ...initialState.settings,
    ...urlState
  })
);

export const getOpen = createSelector(
  [getSaveAOISettings],
  settings => settings.open
);

export const getActiveArea = createSelector(
  [selectLocation, getSaveAOISettings, getAllAreas],
  (location, settings, areas) => {
    if (isEmpty(areas)) return null;
    let activeAreaId = '';
    if (location.type === 'aoi') {
      activeAreaId = location.adm0;
    } else {
      activeAreaId = settings.activeAreaId;
    }

    return areas.find(a => a.id === activeAreaId);
  }
);

export const getModalTitle = createSelector(
  [getActiveArea, selectUserData],
  (activeArea, userData) => {
    if (activeArea && activeArea.userArea && !isEmpty(userData)) {
      return 'Edit Area of Interest';
    }
    return 'Save Area of Interest';
  }
);

export const getModalAOIProps = createStructuredSelector({
  saving: selectSaving,
  loading: selectLoading,
  activeArea: getActiveArea,
  title: getModalTitle,
  open: getOpen,
  error: selectError,
  userData: selectUserData,
  location: selectLocation,
  locationName: getGeodescriberTitleFull
});
