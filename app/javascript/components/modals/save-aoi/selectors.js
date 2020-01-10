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
const selectDeleted = state => state.modalSaveAOI && state.modalSaveAOI.deleted;
const selectSaved = state => state.modalSaveAOI && state.modalSaveAOI.saved;
const selectError = state => state.modalSaveAOI && state.modalSaveAOI.error;
const selectUserData = state => (state.myGfw && state.myGfw.data) || {};
const selectLocation = state => state.location && state.location.payload;
const selectGeostoreId = state =>
  state.geostore && state.geostore.data && state.geostore.data.id;

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
  [getActiveArea, selectUserData, selectSaved, selectDeleted],
  (activeArea, userData, saved, deleted) => {
    if (deleted) {
      return 'Area of Interest Deleted';
    }
    if (saved) {
      return 'Area of Interest Saved';
    }
    if (activeArea && activeArea.userArea && !isEmpty(userData)) {
      return 'Edit Area of Interest';
    }
    return 'Save Area of Interest';
  }
);

export const getModalDesc = createSelector(
  [getActiveArea, selectSaved, selectDeleted],
  (area, saved, deleted) => {
    if (isEmpty(area)) return null;
    const { fireAlerts, deforestationAlerts, monthlySummary, confirmed } = area;
    const hasSubscription = fireAlerts || deforestationAlerts || monthlySummary;

    if (deleted) {
      return 'This area of interest has been deleted from your My GFW.';
    }

    if (saved && hasSubscription && !confirmed) {
      return "<b>Check your email and click on the link to confirm your subscription.</b> If you don't see an email, check your junk or spam email folder.";
    }

    return 'Your area has been updated. You can view all your areas in My GFW.';
  }
);

export const getModalAOIProps = createStructuredSelector({
  saving: selectSaving,
  saved: selectSaved,
  deleted: selectDeleted,
  loading: selectLoading,
  activeArea: getActiveArea,
  title: getModalTitle,
  open: getOpen,
  error: selectError,
  userData: selectUserData,
  location: selectLocation,
  locationName: getGeodescriberTitleFull,
  geostoreId: selectGeostoreId,
  modalDesc: getModalDesc
});
