import { CancelToken, create } from 'axios';
import wriAPISerializer from 'wri-json-api-serializer';

import {
  GFW_TILES_API,
  CARTO_API,
  MAPBOX_API,
  RESOURCE_WATCH_API,
  GFW_DATA_API,
  GFW_STAGING_DATA_API,
  GFW_API,
  GFW_STAGING_API,
} from 'utils/apis';
import { PROXIES } from './proxies';

const ENVIRONMENT = process.env.NEXT_PUBLIC_FEATURE_ENV;
const GFW_API_URL = ENVIRONMENT === 'staging' ? GFW_STAGING_API : GFW_API;
const DATA_API_URL =
  ENVIRONMENT === 'staging' ? GFW_STAGING_DATA_API : GFW_DATA_API;
const GFW_API_KEY = process.env.NEXT_PUBLIC_GFW_API_KEY;
const DATA_API_KEY = process.env.NEXT_PUBLIC_DATA_API_KEY;

const isServer = typeof window === 'undefined';
export const apiRequest = create({
  ...(isServer && {
    baseURL: GFW_API_URL,
    headers: {
      'x-api-key': GFW_API_KEY,
    },
  }),
  ...(!isServer && {
    baseURL: PROXIES.GFW_API,
  }),
  timeout: 30 * 1000,
});

export const dataRequest = create({
  timeout: 30 * 1000,
  ...(isServer && {
    baseURL: DATA_API_URL,
    headers: {
      'x-api-key': DATA_API_KEY,
    },
  }),
  ...(!isServer && {
    baseURL: PROXIES.DATA_API,
  }),
  transformResponse: [(data) => JSON.parse(data)?.data],
});

export const tilesRequest = create({
  timeout: 30 * 1000,
  baseURL: GFW_TILES_API,
  // transformResponse: [(data) => wriAPISerializer(JSON.parse(data))],
});

export const rwRequest = create({
  ...(isServer && {
    baseURL: RESOURCE_WATCH_API,
    headers: {
      'x-api-key': GFW_API_KEY,
    },
  }),
  ...(!isServer && {
    baseURL: `${PROXIES.GFW_API}/v1`,
  }),
  timeout: 30 * 1000,
  transformResponse: [(data) => wriAPISerializer(JSON.parse(data))],
});

export const apiAuthRequest = create({
  ...(isServer && {
    baseURL: GFW_API,
    headers: {
      'content-type': 'application/json',
      'x-api-key': GFW_API_KEY,
    },
  }),
  ...(!isServer && {
    baseURL: PROXIES.GFW_API,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    },
  }),
  timeout: 30 * 1000,
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

export const handleProxyOrigin = () => {
  if (ENVIRONMENT === 'staging') {
    return 'https://staging.globalforestwatch.org/';
  }
  if (ENVIRONMENT === 'preproduction') {
    return 'https://preproduction.globalforestwatch.org/';
  }
  return 'https://www.globalforestwatch.org';
};

export default create({
  timeout: 30 * 1000,
});
