import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { format } from 'd3-format';

const getData = state => state.data || null;
const getBbox = state => state.bbox || null;
const getSettings = state => state.settings || null;

const getFilteredData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (!data || isEmpty(data)) return null;

    const { clouds } = settings;
    return data.filter(item => item.attributes.cloud_score <= clouds);
  }
);

export const getAllTiles = createSelector([getFilteredData], data => {
  if (!data || isEmpty(data)) return [];

  return data.map(item => ({
    id: item.attributes.source,
    url: item.attributes.tile_url,
    thumbnail: item.attributes.thumbnail_url,
    cloudScore: item.attributes.cloud_score,
    dateTime: item.attributes.date_time,
    instrument: item.attributes.instrument,
    description: `${moment(item.attributes.date_time)
      .format('DD MMM YYYY')
      .toUpperCase()} - ${item.attributes.cloud_score}% cloud coverage - ${
      item.attributes.instrument
    }`
  }));
});

export const getTile = createSelector(
  [getFilteredData, getSettings],
  (data, settings) => {
    if (!data || isEmpty(data)) return null;

    const { selectedTileIndex } = settings;
    const selectedTile = data[selectedTileIndex].attributes;
    return {
      url: selectedTile.tile_url,
      cloudScore: selectedTile.cloud_score,
      dateTime: selectedTile.date_time,
      instrument: selectedTile.instrument,
      description: `${moment(selectedTile.date_time)
        .format('DD MMM YYYY')
        .toUpperCase()} - ${format('.0f')(
        selectedTile.cloud_score
      )}% cloud coverage - ${selectedTile.instrument}`
    };
  }
);

export const getBounds = createSelector([getBbox], bbox => {
  if (!bbox || isEmpty(bbox)) return null;

  return bbox.geometry.coordinates;
});

export const getSources = createSelector([getData], data => {
  if (!data || isEmpty(data)) return null;

  const sources = [];
  data.forEach(item => {
    sources.push({ source: item.attributes.source });
  });
  return sources;
});

export const getDates = createSelector([getSettings], settings => {
  const { date, weeks } = settings;
  const currentDate = date ? moment(date) : moment();

  return {
    end: currentDate.format('YYYY-MM-DD'),
    start: currentDate.subtract(weeks, 'weeks').format('YYYY-MM-DD')
  };
});
