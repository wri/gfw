import { createSelector, createStructuredSelector } from 'reselect';

import {
  getDraw,
  getMapLoading,
  getActiveDatasetsFromState,
  getSelectedInteraction
} from 'components/maps/map/selectors';
import { getShowDraw } from 'components/maps/components/analysis/selectors';
import { getTileGeoJSON } from './components/recent-imagery/recent-imagery-selectors';

import initialState from './initial-state';

// state from url
const selectMainMapUrlState = state =>
  state.location && state.location.query && state.location.query.mainMap;
const selectLocation = state => state.location && state.location;
const selectLocationPayload = state => state.location && state.location.payload;
const selectMenuSection = state =>
  state.location.query &&
  state.location.query.menu &&
  state.location.query.menu.menuSection;

// SELECTORS
export const getEmbed = createSelector(
  [selectLocation],
  location => location && location.routesMap[location.type].embed
);

export const getMainMapSettings = createSelector(
  [selectMainMapUrlState],
  urlState => ({
    ...initialState,
    ...urlState
  })
);

export const getHidePanels = createSelector(
  getMainMapSettings,
  settings => settings.hidePanels
);

export const getShowBasemaps = createSelector(
  getMainMapSettings,
  settings => settings.showBasemaps
);

export const getHideLegend = createSelector(
  getMainMapSettings,
  settings => settings.hideLegend
);

export const getShowAnalysis = createSelector(
  getMainMapSettings,
  settings => settings.showAnalysis
);

export const getOneClickAnalysis = createSelector(
  [getShowDraw, selectLocationPayload, getDraw, getMapLoading, getShowAnalysis],
  (showDraw, location, draw, loading, showAnalysis) => {
    const hasLocation = !!location.adm0;
    const isDrawing = draw || showDraw;
    return !hasLocation && !isDrawing && !loading && showAnalysis;
  }
);

export const getMapProps = createStructuredSelector({
  analysisActive: getShowAnalysis,
  oneClickAnalysis: getOneClickAnalysis,
  hidePanels: getHidePanels,
  tileGeoJSON: getTileGeoJSON,
  menuSection: selectMenuSection,
  activeDatasets: getActiveDatasetsFromState,
  embed: getEmbed,
  selectedInteraction: getSelectedInteraction
});
