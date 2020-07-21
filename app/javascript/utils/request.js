import { CancelToken, create } from 'axios';

const isServer = typeof window === 'undefined';

export const apiRequest = create({
  timeout: 30 * 1000,
  baseURL: process.env.GFW_API
});

export const apiAuthRequest = create({
  timeout: 30 * 1000,
  baseURL: process.env.GFW_API,
  headers: {
    'content-type': 'application/json',
    Authorization: `Bearer ${!isServer && localStorage.getItem('userToken')}`
  }
});

export const cartoRequest = create({
  timeout: 30 * 1000,
  baseURL: process.env.CARTO_API
});

export const cancelToken = () => CancelToken.source();

export default create({
  timeout: 30 * 1000
});
