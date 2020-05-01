import { createSelector, createStructuredSelector } from 'reselect';

import {
  getDrawing,
  getMapLoading,
  getActiveDatasetsFromState,
  getInteractionSelected,
  getBasemapFromState,
} from 'components/map/selectors';
import { getShowDraw } from 'components/analysis/selectors';

// state from url
const selectMainMap = (state) => state?.mainMap || {};
const selectLocation = (state) => state.location;
const selectMenuSection = (state) => state?.menu?.menuSection;
const getDrawGeostoreId = (state) => state?.draw?.geostoreId;

// SELECTORS
export const getEmbed = createSelector(
  [selectLocation],
  (location) => location?.embed
);

export const getHidePanels = createSelector(
  selectMainMap,
  (settings) => settings.hidePanels
);

export const getShowBasemaps = createSelector(
  selectMainMap,
  (settings) => settings.showBasemaps
);

export const getShowRecentImagery = createSelector(
  selectMainMap,
  (settings) => settings.showRecentImagery
);

export const getHideLegend = createSelector(
  selectMainMap,
  (settings) => settings.hideLegend
);

export const getShowAnalysis = createSelector(
  selectMainMap,
  (settings) => settings.showAnalysis
);

export const getOneClickAnalysis = createSelector(
  [getShowDraw, selectLocation, getDrawing, getMapLoading, getShowAnalysis],
  (showDraw, location, draw, loading, showAnalysis) => {
    const hasLocation = !!location?.adm0;
    const isDrawing = draw || showDraw;
    return !hasLocation && !isDrawing && !loading && showAnalysis;
  }
);

export default createStructuredSelector({
  analysisActive: getShowAnalysis,
  recentActive: getShowRecentImagery,
  oneClickAnalysis: getOneClickAnalysis,
  hidePanels: getHidePanels,
  menuSection: selectMenuSection,
  activeDatasets: getActiveDatasetsFromState,
  embed: getEmbed,
  geostoreId: getDrawGeostoreId,
  selectedInteraction: getInteractionSelected,
  location: selectLocation,
  basemap: getBasemapFromState,
});
