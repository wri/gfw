import axios from 'axios';
import { getKey, addKey } from 'services/cache';

const EXPIRE_DEFAULT = 86400;
let cacheKeys = [];
let cacheError = false;

export const cacheMiddleware = () => nextDispatch => action => {
  if (action.type === 'setCacheList') {
    cacheKeys = action.payload;
  }
  if (action.type === 'setCacheError') {
    cacheError = true;
  }
  nextDispatch(action);
};

const request = {
  get(url, expire = EXPIRE_DEFAULT) {
    const key = btoa(url);
    if (cacheError || cacheKeys.indexOf(key) === -1) {
      const axiosInstance = axios.create();
      if (!cacheError) {
        axiosInstance.interceptors.response.use(response =>
          addKey(key, response.data, expire).then(() => response)
        );
      }
      return axiosInstance.get(url);
    }
    return getKey(key);
  }
};

export default request;
