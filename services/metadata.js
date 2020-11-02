import { apiRequest } from 'utils/request';

export const getMetadata = (slug) => apiRequest.get(`/v1/gfw-metadata/${slug}`);

export default {
  getMetadata,
};
