import { CancelToken, create } from 'axios';
// import wriAPISerializer from 'wri-json-api-serializer';

import { GFW_API, CARTO_API, MAPBOX_API } from 'utils/constants';

const isServer = typeof window === 'undefined';

export const apiRequest = create({
  timeout: 30 * 1000,
  baseURL: GFW_API,
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
