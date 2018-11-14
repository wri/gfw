import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API}`;

const QUERIES = {
  recentTiles:
    '/recent-tiles?lat={lat}&lon={lng}&start={start}&end={end}&bands={bands}',
  tiles: '/recent-tiles/tiles',
  thumbs: '/recent-tiles/thumbs'
};

export const getRecentTiles = ({ lat, lng, start, end, bands, token }) => {
  const url = `${REQUEST_URL}${QUERIES.recentTiles}`
    .replace('{lat}', lat)
    .replace('{lng}', lng)
    .replace('{start}', start)
    .replace('{end}', end)
    .replace('{bands}', bands || '');
  return axios.get(url, { cancelToken: token });
};

export const getTiles = ({ sources, bands }) =>
  axios.post(`${REQUEST_URL}${QUERIES.tiles}`, {
    source_data: sources,
    bands
  });

export const getThumbs = ({ sources, bands }) =>
  axios.post(`${REQUEST_URL}${QUERIES.thumbs}`, {
    source_data: sources,
    bands
  });
