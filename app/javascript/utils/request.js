import axios from 'axios';
import { getKey, addKey } from 'services/cache';

const cacheKeys = [];

const request = {
  get(url) {
    const key = btoa(url);
    if (cacheKeys.indexOf(key) === -1) {
      const axiosInstance = axios.create();
      axiosInstance.interceptors.response.use(response =>
        addKey(key, response.data.data).then(() => response)
      );
      return axiosInstance.get(url);
    }
    return getKey(key);
  }
};

export default request;
