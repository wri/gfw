import { metadataRequest } from 'utils/request';

export const getMetadata = (slug) => metadataRequest.get(slug);

export default {
  getMetadata,
};
