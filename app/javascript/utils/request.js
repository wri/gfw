import axios, { CancelToken } from 'axios';

export const apiRequest = axios.create({
  timeout: 30 * 1000,
  baseURL: process.env.GFW_API
});

export const apiAuthRequest = axios.create({
  timeout: 30 * 1000,
  baseURL: process.env.GFW_API,
  headers: {
    'content-type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('userToken')}`
  }
});

export const cartoRequest = axios.create({
  timeout: 30 * 1000,
  baseURL: process.env.CARTO_API
});

export const cancelToken = () => CancelToken.source();

export default axios.create({
  timeout: 30 * 1000
});
