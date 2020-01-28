import { apiRequest } from 'utils/request';

const QUERIES = {
  recentTiles:
    '/recent-tiles?lat={lat}&lon={lng}&start={start}&end={end}&bands={bands}',
  tiles: '/recent-tiles/tiles',
  thumbs: '/recent-tiles/thumbs'
};

export const getRecentTiles = ({ lat, lng, start, end, bands, token }) => {
  const url = `${QUERIES.recentTiles}`
    .replace('{lat}', lat)
    .replace('{lng}', lng)
    .replace('{start}', start)
    .replace('{end}', end)
    .replace('{bands}', !bands ? '' : bands);
  return apiRequest.get(url, { cancelToken: token });
};

export const getTiles = ({ sources, bands }) =>
  apiRequest.post(`${QUERIES.tiles}`, {
    source_data: sources,
    bands: !bands ? '' : bands
  });

export const getThumbs = ({ sources, bands }) =>
  apiRequest.post(`${QUERIES.thumbs}`, {
    source_data: sources,
    bands: !bands ? '' : bands
  });
