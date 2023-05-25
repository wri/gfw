import { CancelToken, create } from 'axios';
import wriAPISerializer from 'wri-json-api-serializer';

import {
  CARTO_API,
  MAPBOX_API,
  RESOURCE_WATCH_API,
  GFW_DATA_API,
  GFW_STAGING_DATA_API,
  GFW_API,
  GFW_STAGING_API,
  GFW_METADATA_API,
  GFW_STAGING_METADATA_API,
} from 'utils/apis';
import { PROXIES } from './proxies';

const ENVIRONMENT = process.env.NEXT_PUBLIC_FEATURE_ENV;

const GFW_API_URL = ENVIRONMENT === 'staging' ? GFW_STAGING_API : GFW_API;
const GFW_METADATA_API_URL =
  ENVIRONMENT === 'staging' ? GFW_STAGING_METADATA_API : GFW_METADATA_API;
const DATA_API_URL =
  ENVIRONMENT === 'staging' ? GFW_STAGING_DATA_API : GFW_DATA_API;

// We never use the `staging-api.resourcewatch.org`.
const RESOURCE_WATCH_API_URL = RESOURCE_WATCH_API;

// At the moment, the API key is the same
const GFW_API_KEY = process.env.NEXT_PUBLIC_GFW_API_KEY;
const GFW_METADATA_API_KEY = GFW_API_KEY;
const DATA_API_KEY = GFW_API_KEY;
const RESOURCE_WATCH_API_KEY = GFW_API_KEY;

const isServer = typeof window === 'undefined';

const defaultRequestConfig = {
  timeout: 30 * 1000,
};

export const apiRequest = create({
  ...defaultRequestConfig,
  ...(isServer && {
    baseURL: GFW_API_URL,
    headers: {
      'x-api-key': GFW_API_KEY,
    },
  }),
  ...(!isServer && {
    baseURL: PROXIES.GFW_API,
  }),
});

export const dataRequest = create({
  ...defaultRequestConfig,
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

export const metadataRequest = create({
  ...defaultRequestConfig,
  ...(isServer && {
    baseURL: GFW_METADATA_API_URL,
    headers: {
      'x-api-key': GFW_METADATA_API_KEY,
    },
  }),
  ...(!isServer && {
    baseURL: PROXIES.METADATA_API,
  }),
});

export const rwRequest = create({
  ...defaultRequestConfig,
  ...(isServer && {
    baseURL: RESOURCE_WATCH_API_URL,
    headers: {
      'x-api-key': RESOURCE_WATCH_API_KEY,
    },
  }),
  ...(!isServer && {
    baseURL: PROXIES.RESOURCE_WATCH_API,
  }),
  transformResponse: [(data) => wriAPISerializer(JSON.parse(data))],
});

export const apiAuthRequest = create({
  ...defaultRequestConfig,
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
});

export const cartoRequest = create({
  ...defaultRequestConfig,
  baseURL: CARTO_API,
});

export const mapboxRequest = create({
  ...defaultRequestConfig,
  baseURL: MAPBOX_API,
});

export const cancelToken = () => CancelToken.source();

export default create({
  ...defaultRequestConfig,
});
