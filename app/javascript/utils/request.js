import axios from 'axios';
import { getKey, addKey } from 'services/cache';

let cacheKeys = [];

export const cacheMiddleware = () => nextDispatch => action => {
  if (action.type === 'setCacheList') {
    cacheKeys = action.payload;
  }
  nextDispatch(action);
};

const request = {
  get(url) {
    const key = btoa(url);
    if (cacheKeys.indexOf(key) === -1) {
      const axiosInstance = axios.create();
      axiosInstance.interceptors.response.use(response =>
        addKey(key, response.data).then(() => response)
      );
      return axiosInstance.get(url);
    }
    return getKey(key);
  }
};

export default request;
