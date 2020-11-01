import { CancelToken, create } from 'axios';
// import wriAPISerializer from 'wri-json-api-serializer';

import {
  GFW_API,
  GFW_DATA_API,
  GFW_TILES_API,
  CARTO_API,
  MAPBOX_API,
  RESOURCE_WATCH_API,
} from 'utils/apis';

const isServer = typeof window === 'undefined';

export const apiRequest = create({
  timeout: 30 * 1000,
  baseURL: GFW_API,
  // transformResponse: [(data) => wriAPISerializer(JSON.parse(data))],
});

export const dataRequest = create({
  timeout: 30 * 1000,
  baseURL: GFW_DATA_API,
  // transformResponse: [(data) => wriAPISerializer(JSON.parse(data))],
});

export const tilesRequest = create({
  timeout: 30 * 1000,
  baseURL: GFW_TILES_API,
  // transformResponse: [(data) => wriAPISerializer(JSON.parse(data))],
});

export const rwRequest = create({
  timeout: 30 * 1000,
  baseURL: RESOURCE_WATCH_API,
  // transformResponse: [(data) => wriAPISerializer(JSON.parse(data))],
});

export const apiAuthRequest = create({
  timeout: 30 * 1000,
  baseURL: GFW_API,
  headers: {
    'content-type': 'application/json',
    Authorization: `Bearer ${!isServer && localStorage.getItem('userToken')}`,
  },
  // transformResponse: [(data) => wriAPISerializer(JSON.parse(data))],
});

export const cartoRequest = create({
  timeout: 30 * 1000,
  baseURL: CARTO_API,
});

export const mapboxRequest = create({
  timeout: 30 * 1000,
  baseURL: MAPBOX_API,
});

export const cancelToken = () => CancelToken.source();

export default create({
  timeout: 30 * 1000,
});
