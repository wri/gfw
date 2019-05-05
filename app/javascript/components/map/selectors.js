import { createSelector, createStructuredSelector } from 'reselect';

import { initialState } from './reducers';
import basemaps from './basemaps';

// map state
const selectMapUrlState = state =>
  state.location && state.location.query && state.location.query.map;
const selectMapLoading = state => state.map && state.map.loading;

// CONSTS
export const getBasemaps = () => basemaps;

// SELECTORS
export const getMapSettings = createSelector([selectMapUrlState], urlState => ({
  ...initialState.settings,
  ...urlState
}));

export const getMapViewport = createSelector(
  [getMapSettings],
  settings => settings.viewport
);

export const getMapMinZoom = createSelector(
  [getMapSettings],
  settings => settings.minZoom
);

export const getMapMaxZoom = createSelector(
  [getMapSettings],
  settings => settings.maxZoom
);

export const getBasemapFromState = createSelector(
  getMapSettings,
  settings => settings.basemap
);

export const getBasemap = createSelector(
  [getBasemapFromState],
  basemapState => ({
    ...basemaps[basemapState.value],
    ...basemapState
  })
);

export const getMapStyle = createSelector(
  getBasemap,
  basemap => basemap.mapStyle
);

export const getMapLabels = createSelector(
  getMapSettings,
  settings => settings.labels
);

export const getMapRoads = createSelector(
  getMapSettings,
  settings => settings.roads
);

export const getMapProps = createStructuredSelector({
  viewport: getMapViewport,
  loading: selectMapLoading,
  minZoom: getMapMinZoom,
  maxZoom: getMapMaxZoom,
  mapStyle: getMapStyle,
  mapLabels: getMapLabels,
  mapRoads: getMapRoads
});
