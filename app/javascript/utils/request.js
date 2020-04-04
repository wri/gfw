import { CancelToken, create } from 'axios';
import { GFW_API, CARTO_API } from 'utils/constants';

export const apiRequest = create({
  timeout: 30 * 1000,
  baseURL: GFW_API,
});

export const apiAuthRequest = create({
  timeout: 30 * 1000,
  baseURL: GFW_API,
  headers: {
    'content-type': 'application/json',
    Authorization: `Bearer {token}`,
  },
});

export const cartoRequest = create({
  timeout: 30 * 1000,
  baseURL: CARTO_API,
});

export const cancelToken = () => CancelToken.source();

export default create({
  timeout: 30 * 1000,
});
