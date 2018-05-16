import axios from 'axios';
import find from 'lodash/find';
import moment from 'moment';
import { getKey, addKey } from 'services/cache';
import CACHE_EXCEPTIONS from 'data/cache-exceptions.json';

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
  get(url, expire = EXPIRE_DEFAULT, exceptionId = null) {
    const key = btoa(url);
    if (cacheError || cacheKeys.indexOf(key) === -1) {
      const axiosInstance = axios.create();
      const haveException = checkException(exceptionId);
      if (!cacheError && !haveException) {
        axiosInstance.interceptors.response.use(response => {
          addKey(key, response.data, expire, exceptionId);
          return response;
        });
      }
      return axiosInstance.get(url);
    }
    return getKey(key);
  }
};

const checkException = exceptionId => {
  const exception = find(CACHE_EXCEPTIONS, item => item.id === exceptionId);
  let haveException = false;
  if (exception && exception.type === 'excludeWeekDay') {
    haveException = exception.data.indexOf(moment().day()) !== -1;
  }

  return haveException;
};

export default request;
