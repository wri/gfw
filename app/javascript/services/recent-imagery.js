import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API_HOST_PROD}`;

const QUERIES = {
  recentTiles:
    '/recent-tiles?lat={latitude}&lon={longitude}&start={start}&end={end}',
  tiles: '/recent-tiles/tiles',
  thumbs: '/recent-tiles/thumbs'
};

export const getRecentTiles = ({ latitude, longitude, start, end, token }) => {
  const url = `${REQUEST_URL}${QUERIES.recentTiles}`
    .replace('{latitude}', latitude)
    .replace('{longitude}', longitude)
    .replace('{start}', start)
    .replace('{end}', end);
  return axios.get(url, { cancelToken: token });
};

export const getTiles = ({ sources, token }) =>
  axios.post(`${REQUEST_URL}${QUERIES.tiles}`, {
    source_data: sources,
    cancelToken: token
  });

export const getThumbs = ({ sources, token }) =>
  axios.post(`${REQUEST_URL}${QUERIES.thumbs}`, {
    source_data: sources,
    cancelToken: token
  });
