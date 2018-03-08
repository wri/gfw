import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API_HOST_PROD}`;

const QUERIES = {
  recentTiles:
    '/recent-tiles?lat={latitude}&lon={longitude}&start={start}&end={end}',
  tiles: '/recent-tiles/tiles',
  thumbs: '/recent-tiles/thumbs'
};

export const getRecentTiles = ({ latitude, longitude, start, end }) => {
  const url = `${REQUEST_URL}${QUERIES.recentTiles}`
    .replace('{latitude}', latitude)
    .replace('{longitude}', longitude)
    .replace('{start}', start)
    .replace('{end}', end);
  return axios.get(url);
};

export const getTiles = source =>
  axios.post(`${REQUEST_URL}${QUERIES.tiles}`, { source_data: source });

export const getThumbs = source =>
  axios.post(`${REQUEST_URL}${QUERIES.thumbs}`, { source_data: source });
