import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import moment from 'moment';

import { getMapSettings, getActiveDatasetsState } from 'components/map-v2/selectors';

const getData = state => state.data && state.data.tiles || null;
const getDataStatus = state => state.dataStatus || null;
const getSettings = state => state.settings || null;
const getActive = state => state.active || null;
const getVisibility = state => state.visible || null;
const getTimelineOpen = state => state.timelineOpen || null;

const getPosition = createSelector(
  [getMapSettings],
  settings => settings.center
);

const getZoom = createSelector(
  [getMapSettings],
  settings => settings.zoom
);

const getFilteredData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (!data || isEmpty(data)) return null;

    const { clouds } = settings;
    return data
      .filter(item => Math.round(item.attributes.cloud_score) <= clouds)
      .map(item => item.attributes);
  }
);

export const getAllTiles = createSelector([getFilteredData], data => {
  if (!data || isEmpty(data)) return [];

  return data.map(item => ({
    id: item.source,
    url: item.tile_url,
    thumbnail: item.thumbnail_url,
    cloudScore: item.cloud_score,
    dateTime: item.date_time,
    instrument: item.instrument
  }));
});

export const getTile = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (!data || isEmpty(data)) return null;

    const { selectedTileSource } = settings;
    const index = findIndex(
      data,
      d => d.attributes.source === selectedTileSource
    );

    const selectedTile = data[index].attributes;
    return {
      url: selectedTile.tile_url,
      cloudScore: selectedTile.cloud_score,
      dateTime: selectedTile.date_time,
      instrument: selectedTile.instrument
    };
  }
);

export const getBounds = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (!data || isEmpty(data)) return null;

    const { selectedTileSource } = settings;
    const index = findIndex(
      data,
      d => d.attributes.source === selectedTileSource
    );

    return data[index].attributes.bbox.geometry.coordinates;
  }
);

export const getSources = createSelector(
  [getData, getDataStatus],
  (data, dataStatus) => {
    if (!data || isEmpty(data)) return null;

    const { tilesPerRequest, requestedTiles } = dataStatus;
    return data
      .slice(requestedTiles, requestedTiles + tilesPerRequest)
      .map(item => ({ source: item.attributes.source }));
  }
);

export const getDates = createSelector([getSettings], settings => {
  const { date, weeks } = settings;
  const currentDate = date ? moment(date) : moment();

  return {
    end: currentDate.format('YYYY-MM-DD'),
    start: currentDate.subtract(weeks, 'weeks').format('YYYY-MM-DD')
  };
});

export const getProps = createStructuredSelector({
  active: getActive,
  visible: getVisibility,
  isTimelineOpen: getTimelineOpen,
  dataStatus: getDataStatus,
  allTiles: getAllTiles,
  tile: getTile,
  bounds: getBounds,
  sources: getSources,
  dates: getDates,
  settings: getSettings,
  mapSettings: getMapSettings,
  position: getPosition,
  zoom: getZoom,
  datasets: getActiveDatasetsState
});
