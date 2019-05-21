import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import { checkLocationInsideBbox } from 'utils/geoms';

import { initialState as mapInitialState } from 'components/maps/map/reducers';
import { initialState } from './recent-imagery-reducers';

const getData = state => state.recentImagery && state.recentImagery.data;
const getClassifiedUrl = state =>
  state.recentImagery && state.recentImagery.classifiedImage;
export const getRecentImageryLoading = state =>
  state.recentImagery && state.recentImagery.loading;
export const getMoreTilesLoading = state =>
  state.recentImagery && state.recentImagery.loadingMoreTiles;
const getError = state => state.recentImagery && state.recentImagery.error;
const getLocation = state => state.location && state.location.query;
const getDataStatus = state =>
  state.recentImagery && state.recentImagery.dataStatus;
const getDatasets = state => state.datasets && state.datasets.data;
const getRecentUrlState = state =>
  state.location && state.location.query && state.location.query.recentImagery;
const getMapUrlState = state =>
  state.location && state.location.query && state.location.query.map;

export const getActive = (state, { active }) => active;

export const getMapSettings = createSelector([getMapUrlState], urlState => ({
  ...(mapInitialState && {
    ...mapInitialState.settings
  }),
  ...urlState
}));

export const getRecentImagerySettings = createSelector(
  [getRecentUrlState],
  urlState => ({
    ...(initialState && {
      ...initialState.settings
    }),
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

export const getActiveDatasetsFromState = createSelector(
  getMapSettings,
  settings => settings.datasets
);

// export const getActive = createSelector(
//   [getActiveDatasetsFromState, getActive],
//   (datasets, active) => {
//     if (isEmpty(datasets)) return null;
//     return active && !!datasets.find(d => d.isRecentImagery);
//   }
// );

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

export const getTiles = createSelector([getFilteredTiles], data => {
  if (!data || isEmpty(data)) return [];
  return sortBy(data, d => new Date(d.dateTime)).reverse();
});

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
      ? checkLocationInsideBbox([position.lat, position.lng], bounds)
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
  moreTilesLoading: getMoreTilesLoading,
  error: getError,
  active: getActive,
  dates: getDates,
  sources: getSources,
  settings: getRecentImagerySettings,
  position: getPosition,
  zoom: getMapZoom,
  // data
  dataStatus: getDataStatus,
  tiles: getTiles,
  activeTile: getActiveTile,
  positionInsideTile: getPositionInsideTile,
  location: getLocation,
  // url props
  datasets: getActiveDatasetsFromState,
  recentImageryDataset: getRecentImageryDataset,
  classifiedImage: getClassifiedUrl
});
