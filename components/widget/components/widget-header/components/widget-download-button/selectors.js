import { createStructuredSelector, createSelector } from 'reselect';

import { getDataLocation } from 'utils/location';

const selectGeostoreSize = state =>
  state.geostore && state.geostore.data && state.geostore.data.areaHa;
const getGladAlertsDownloadUrls = state =>
  state.widgets &&
  state.widgets.data &&
  state.widgets.data.gladAlerts &&
  state.widgets.data.gladAlerts.downloadUrls;

export const checkGeostoreSize = createSelector(
  [selectGeostoreSize, getDataLocation],
  (areaHa, location) => {
    if (['aoi', 'geostore'].includes(location.type)) {
      return areaHa > 100000000;
    }

    return false;
  }
);

export default createStructuredSelector({
  gladAlertsDownloadUrls: getGladAlertsDownloadUrls,
  areaTooLarge: checkGeostoreSize
});
