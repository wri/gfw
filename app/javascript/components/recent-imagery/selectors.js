import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { checkLocationInsideBbox } from 'utils/geoms';

import {
  getMapViewport,
  getMapZoom,
  getActiveDatasetsFromState
} from 'components/map/selectors';

import { initialState } from './reducers';

const getData = state => state.recentImagery && state.recentImagery.data;
export const getRecentImageryLoading = state =>
  state.recentImagery && state.recentImagery.loading;
export const getLoadingMoreTiles = state =>
  state.recentImagery && state.recentImagery.loadingMoreTiles;
const getError = state => state.recentImagery && state.recentImagery.error;
const getLocation = state => state.location && state.location.query;
const getDataStatus = state =>
  state.recentImagery && state.recentImagery.dataStatus;
const getDatasets = state => state.datasets && state.datasets.data;
const getRecentUrlState = state =>
  state.location && state.location.query && state.location.query.recentImagery;

export const getActive = (state, { active }) => active;

export const getRecentImagerySettings = createSelector(
  [getRecentUrlState],
  urlState => ({
    ...(initialState && {
      ...initialState.settings
    }),
    ...urlState
  })
);

export const getPosition = createSelector([getMapViewport], viewport => ({
  lat: viewport.latitude,
  lng: viewport.longitude
}));

export const getFilteredTiles = createSelector(
  [getData, getRecentImagerySettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    const { clouds } = settings;

    return data.filter(item => item.cloud_score <= clouds).map(t => ({
      id: t.source,
      url: t.tile_url,
      thumbnail: t.thumbnail_url,
      cloudScore: t.cloud_score,
      dateTime: t.date_time,
      instrument: t.instrument,
      bbox: t.bbox
    }));
  }
);

export const getActiveTile = createSelector(
  [getFilteredTiles, getRecentImagerySettings],
  (tiles, settings) => {
    if (isEmpty(tiles)) return null;
    const { selected, selectedIndex } = settings;
    const selectedTileById = tiles.find(t => t.id === selected);
    if (selectedTileById) return selectedTileById;
    const selectedTileByIndex = selectedIndex && tiles[selectedIndex];

    return selectedTileByIndex || tiles[0];
  }
);

export const getTileBounds = createSelector([getActiveTile], activeTile => {
  if (!activeTile) return null;
  return activeTile.bbox.geometry.coordinates;
});

export const getPositionInsideTile = createSelector(
  [getTileBounds, getPosition],
  (bounds, position) =>
    (bounds
      ? checkLocationInsideBbox([position.lng, position.lat], bounds)
      : true)
);

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
    end: moment(currentDate).format('YYYY-MM-DD'),
    start: moment(currentDate)
      .subtract(weeks, 'weeks')
      .format('YYYY-MM-DD')
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
  loading: getRecentImageryLoading,
  loadingMoreTiles: getLoadingMoreTiles,
  error: getError,
  active: getActive,
  dates: getDates,
  sources: getSources,
  settings: getRecentImagerySettings,
  position: getPosition,
  zoom: getMapZoom,
  // data
  dataStatus: getDataStatus,
  tiles: getFilteredTiles,
  activeTile: getActiveTile,
  positionInsideTile: getPositionInsideTile,
  location: getLocation,
  // url props
  datasets: getActiveDatasetsFromState,
  recentImageryDataset: getRecentImageryDataset
});
