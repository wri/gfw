import { createSelector, createStructuredSelector } from 'reselect';

import {
  getDrawing,
  getMapLoading,
  getActiveDatasetsFromState,
  getInteractionSelected,
  getBasemapFromState,
} from 'components/map/selectors';

const getMainMapSettings = (state) => state.mainMap || {};
const selectLocation = (state) => state.location && state.location;
const selectLocationPayload = (state) =>
  state.location && state.location.payload;
const selectMenuSection = (state) =>
  state.location &&
  state.location.query &&
  state.location.query.menu &&
  state.location.query.menu.menuSection;
const getDrawGeostoreId = (state) => state.draw && state.draw.geostoreId;
const getShowDraw = (state) => state.analysis?.showDraw;

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

export const getOneClickAnalysis = createSelector(
  [
    getShowDraw,
    selectLocationPayload,
    getDrawing,
    getMapLoading,
    getShowAnalysis,
  ],
  (showDraw, location, draw, loading, showAnalysis) => {
    const hasLocation = !!location?.adm0;
    const isDrawing = draw || showDraw;
    return !hasLocation && !isDrawing && !loading && showAnalysis;
  }
);

export const getMapProps = createStructuredSelector({
  analysisActive: getShowAnalysis,
  recentActive: getShowRecentImagery,
  oneClickAnalysis: getOneClickAnalysis,
  hidePanels: getHidePanels,
  menuSection: selectMenuSection,
  activeDatasets: getActiveDatasetsFromState,
  embed: getEmbed,
  geostoreId: getDrawGeostoreId,
  selectedInteraction: getInteractionSelected,
  location: selectLocationPayload,
  basemap: getBasemapFromState,
});
