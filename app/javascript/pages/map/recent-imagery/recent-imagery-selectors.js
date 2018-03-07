import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

const getData = state => state.data || null;
const getSettings = state => state.settings || null;

export const getTile = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (!data || isEmpty(data)) return null;

    const { tileIndex } = settings;
    const selectedTile = data[tileIndex].attributes;
    return {
      url: selectedTile.tile_url,
      cloudScore: selectedTile.cloud_score,
      dateTime: selectedTile.date_time,
      instrument: selectedTile.instrument
    };
  }
);

export const getBounds = createSelector([getData], data => {
  if (!data || isEmpty(data)) return null;

  return data[0].attributes.bbox.geometry.coordinates;
});

export const getSources = createSelector([getData], data => {
  if (!data || isEmpty(data)) return null;

  const sources = [];
  data.forEach(item => {
    sources.push(item.attributes.source);
  });
  return sources;
});

export const getDates = createSelector([], () => ({
  start: '2016-01-01',
  end: '2016-09-01'
}));
