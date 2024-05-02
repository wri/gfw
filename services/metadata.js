import { metadataRequest } from 'utils/request';

export const getMetadata = (slug, metaType) => {
  if (metaType === 'widget') {
    return metadataRequest.get(slug);
  }

  return metadataRequest.get(slug);
};

export default {
  getMetadata,
};
