import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API}`;

const QUERIES = {
  recentTiles:
    '/recent-tiles?lat={latitude}&lon={longitude}&start={start}&end={end}&bands={bands}',
  tiles: '/recent-tiles/tiles?bands={bands}',
  thumbs: '/recent-tiles/thumbs?bands={bands}'
};

export const getRecentTiles = ({
  latitude,
  longitude,
  start,
  end,
  bands,
  token
}) => {
  const url = `${REQUEST_URL}${QUERIES.recentTiles}`
    .replace('{latitude}', latitude)
    .replace('{longitude}', longitude)
    .replace('{start}', start)
    .replace('{end}', end)
    .replace('{bands}', bands || '');
  return axios.get(url, { cancelToken: token });
};

export const getTiles = ({ sources, token, bands }) =>
  axios.post(`${REQUEST_URL}${QUERIES.tiles}`.replace('{bands}', bands || ''), {
    source_data: sources,
    cancelToken: token
  });

export const getThumbs = ({ sources, token, bands }) =>
  axios.post(
    `${REQUEST_URL}${QUERIES.thumbs}`.replace('{bands}', bands || ''),
    {
      source_data: sources,
      cancelToken: token
    }
  );
