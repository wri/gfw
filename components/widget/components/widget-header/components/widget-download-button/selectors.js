import { createStructuredSelector, createSelector } from 'reselect';

import { getDataLocation } from 'utils/location';

const selectGeostoreSize = (state) =>
  state.geostore && state.geostore.data && state.geostore.data.areaHa;
const getGladAlertsDownloadUrls = (state) =>
  state.widgets &&
  state.widgets.data &&
  state.widgets.data.gladAlerts &&
  state.widgets.data.gladAlerts.downloadUrls;

const getMapSettings = (state) => {
  const { settings } = state.map;
  const { center, zoom, pitch, bearing, bbox } = settings;
  return { center, zoom, pitch, bearing, bbox };
};

export const checkGeostoreSize = createSelector(
  [selectGeostoreSize, getDataLocation],
  (areaHa, location) => {
    if (['aoi', 'geostore'].includes(location.type)) {
      const ONE_BILLION_H = 1000000000;
      return areaHa > ONE_BILLION_H;
    }

    return false;
  }
);

export default createStructuredSelector({
  gladAlertsDownloadUrls: getGladAlertsDownloadUrls,
  areaTooLarge: checkGeostoreSize,
  mapSettings: getMapSettings,
});
