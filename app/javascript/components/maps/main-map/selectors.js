import { createSelector, createStructuredSelector } from 'reselect';

import {
  getDraw,
  getMapLoading,
  getActiveDatasetsFromState,
  getEmbed
} from 'components/maps/map/selectors';
import { getTileGeoJSON } from './components/recent-imagery/recent-imagery-selectors';

import initialState from './initial-state';

// state from url
const getMapMainUrlState = state =>
  state.location && state.location.query && state.location.query.mapMain;
const selectLocation = state => state.location && state.location.payload;

// analysis selects
const selectAnalysisSettings = state =>
  state.location && state.location.query && state.location.query.analysis;
const selectMenuSection = state =>
  state.location.query &&
  state.location.query.menu &&
  state.location.query.menu.menuSection;

// SELECTORS
export const getMainMapSettings = createSelector(
  [getMapMainUrlState],
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

export const getOneClickAnalysisActive = createSelector(
  [selectAnalysisSettings, selectLocation, getDraw, getMapLoading],
  (settings, location, draw, loading) =>
    settings &&
    !draw &&
    !loading &&
    settings.showAnalysis &&
    !settings.showDraw &&
    !location.adm0
);

export const getMapProps = createStructuredSelector({
  analysisActive: getShowAnalysis,
  oneClickAnalysisActive: getOneClickAnalysisActive,
  hidePanels: getHidePanels,
  tileGeoJSON: getTileGeoJSON,
  menuSection: selectMenuSection,
  activeDatasets: getActiveDatasetsFromState,
  embed: getEmbed
});
