import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import moment from 'moment';

import { initialState as mapInitialState } from 'components/maps/map/reducers';
import { initialState } from './recent-imagery-reducers';

const getData = state =>
  (state.recentImagery && state.recentImagery.data) || null;
export const getRecentImageryLoading = state =>
  (state.recentImagery && state.recentImagery.loading) || null;
export const getMoreTilesLoading = state =>
  (state.recentImagery && state.recentImagery.loadingMoreTiles) || null;
const getError = state => state.recentImagery && state.recentImagery.error;
const getLocation = state => state.location && state.location.query;
const getDataStatus = state =>
  (state.recentImagery && state.recentImagery.dataStatus) || null;
const getDatasets = state => (state.datasets && state.datasets.data) || null;
const getRecentUrlState = state =>
  (state.location &&
    state.location.query &&
    state.location.query.recentImagery) ||
  null;
const getMapUrlState = state =>
  (state.location && state.location.query && state.location.query.map) || null;

export const getMapSettings = createSelector([getMapUrlState], urlState => ({
  ...mapInitialState.settings,
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

export const getActiveDatasetsFromState = createSelector(
  getMapSettings,
  settings => settings.datasets
);

export const getVisibility = createSelector(
  [getRecentImagerySettings],
  settings => settings.visible
);

export const getActive = createSelector(
  [getActiveDatasetsFromState],
  datasets => {
    if (isEmpty(datasets)) return null;
    return !!datasets.find(d => d.isRecentImagery);
  }
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

  return sortBy(
    data.map(item => ({
      id: item.source,
      url: item.tile_url,
      thumbnail: item.thumbnail_url,
      cloudScore: item.cloud_score,
      dateTime: item.date_time,
      instrument: item.instrument,
      bbox: item.bbox
    })),
    d => new Date(d.dateTime)
  ).reverse();
});

export const getActiveTile = createSelector(
  [getTiles, getRecentImagerySettings],
  (tiles, settings) => {
    if (isEmpty(tiles)) return null;
    const { selected, selectedIndex } = settings;
    const selectedTileById = tiles.find(t => t.id === selected);
    if (selectedTileById) return selectedTileById;
    const selectedTileByIndex = selectedIndex && tiles[selectedIndex];
    return selectedTileByIndex || tiles[0];
  }
);

export const getTileGeoJSON = createSelector([getActiveTile], activeTile => {
  if (!activeTile) return null;
  return {
    features: [
      {
        type: 'Feature',
        properties: {
          ...activeTile
        },
        geometry: {
          type: 'Polygon',
          coordinates: [activeTile.bbox.geometry.coordinates]
        }
      }
    ]
  };
});

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
  loading: getRecentImageryLoading,
  moreTilesLoading: getMoreTilesLoading,
  error: getError,
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
  location: getLocation,
  // url props
  datasets: getActiveDatasetsFromState,
  recentImageryDataset: getRecentImageryDataset
});
