import { apiRequest } from 'utils/request';

export const getMeta = slug => apiRequest.get(`/v1/gfw-metadata/${slug}`);

export default {
  getMeta
};
