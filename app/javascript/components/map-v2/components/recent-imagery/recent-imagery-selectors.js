import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import mapInitialState from 'components/map-v2/initial-state';
import { initialState } from './recent-imagery-reducers';

const getData = state => state.recentImagery.data || null;
const getDataStatus = state => state.recentImagery.dataStatus || null;
const getDatasets = state => state.datasets.datasets || null;
const getRecentUrlState = state =>
  (state.location &&
    state.location.query &&
    state.location.query.recentImagery) ||
  null;
const getMapUrlState = state =>
  (state.location && state.location.query && state.location.query.map) || null;

export const getMapSettings = createSelector([getMapUrlState], urlState => ({
  ...mapInitialState,
  ...urlState
}));

export const getRecentImagerySettings = createSelector(
  [getRecentUrlState],
  urlState => ({
    ...initialState.settings,
    ...urlState
  })
);

export const getMapZoom = createSelector(
  getMapSettings,
  settings => settings.zoom
);

export const getPosition = createSelector([getMapSettings], settings => ({
  lat: settings.center.lng,
  lng: settings.center.lat
}));

export const getActiveDatasetsState = createSelector(
  getMapSettings,
  settings => settings.datasets
);

export const getVisibility = createSelector(
  [getRecentImagerySettings],
  settings => settings.visible
);

export const getActive = createSelector(
  [getRecentImagerySettings],
  settings => settings.active
);

export const getFilteredData = createSelector(
  [getData, getRecentImagerySettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    const { clouds } = settings;

    return data
      .filter(item => Math.round(item.cloud_score) <= clouds)
      .map(item => item);
  }
);

export const getTiles = createSelector([getFilteredData], data => {
  if (!data || isEmpty(data)) return [];

  return data.map(item => ({
    id: item.source,
    url: item.tile_url,
    thumbnail: item.thumbnail_url,
    cloudScore: item.cloud_score,
    dateTime: item.date_time,
    instrument: item.instrument,
    bbox: item.bbox
  }));
});

export const getActiveTile = createSelector(
  [getTiles, getRecentImagerySettings],
  (tiles, settings) => {
    if (isEmpty(tiles)) return null;
    const { selected } = settings;

    return selected ? tiles.find(t => t.id === selected) : tiles[0];
  }
);

export const getTileBounds = createSelector([getActiveTile], activeTile => {
  if (!activeTile) return null;
  return activeTile.bbox.geometry.coordinates;
});

export const getSources = createSelector(
  [getData, getDataStatus],
  (data, dataStatus) => {
    if (!data || isEmpty(data)) return null;

    const { tilesPerRequest, requestedTiles } = dataStatus;
    return data
      .slice(requestedTiles, requestedTiles + tilesPerRequest)
      .map(item => ({ source: item.source }));
  }
);

export const getDates = createSelector([getRecentImagerySettings], settings => {
  const { date, weeks } = settings;
  const currentDate = date ? moment(date) : moment();

  return {
    end: currentDate.format('YYYY-MM-DD'),
    start: currentDate.subtract(weeks, 'weeks').format('YYYY-MM-DD')
  };
});

export const getRecentImageryDataset = createSelector(
  [getDatasets],
  datasets => {
    if (isEmpty(datasets)) return null;
    return datasets.find(d => d.isRecentImagery);
  }
);

export const getRecentImageryProps = createStructuredSelector({
  // settings
  active: getActive,
  visible: getVisibility,
  dates: getDates,
  sources: getSources,
  settings: getRecentImagerySettings,
  position: getPosition,
  zoom: getMapZoom,
  // data
  dataStatus: getDataStatus,
  tiles: getTiles,
  activeTile: getActiveTile,
  bounds: getTileBounds,
  // url props
  datasets: getActiveDatasetsState,
  recentImageryDataset: getRecentImageryDataset
});
