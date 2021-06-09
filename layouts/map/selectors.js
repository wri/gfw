import { createSelector, createStructuredSelector } from 'reselect';

import {
  getActiveDatasetsFromState,
  getBasemapFromState,
} from 'components/map/selectors';

const getMainMapSettings = (state) => state.mainMap || {};
const selectLocation = (state) => state.location && state.location;
const selectLocationPayload = (state) =>
  state.location && state.location.payload;
const selectMenuSection = (state) => state.mapMenu?.settings?.menuSection;
const getDrawGeostoreId = (state) => state.draw && state.draw.geostoreId;


// SELECTORS
export const getEmbed = createSelector(
  [selectLocation],
  (location) => location && location.pathname.includes('/embed')
);

export const getHidePanels = createSelector(
  getMainMapSettings,
  (settings) => settings.hidePanels
);

export const getShowBasemaps = createSelector(
  getMainMapSettings,
  (settings) => settings.showBasemaps
);

export const getShowRecentImagery = createSelector(
  getMainMapSettings,
  (settings) => settings.showRecentImagery
);

export const getHideLegend = createSelector(
  getMainMapSettings,
  (settings) => settings.hideLegend
);

export const getShowAnalysis = createSelector(
  getMainMapSettings,
  (settings) => settings.showAnalysis
);

export const getMapProps = createStructuredSelector({
  analysisActive: getShowAnalysis,
  recentActive: getShowRecentImagery,
  hidePanels: getHidePanels,
  menuSection: selectMenuSection,
  activeDatasets: getActiveDatasetsFromState,
  embed: getEmbed,
  geostoreId: getDrawGeostoreId,
  location: selectLocationPayload,
  basemap: getBasemapFromState,
});
