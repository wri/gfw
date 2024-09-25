import { metadataRequest, metadataWidgetRequest } from 'utils/request';

export const getMetadata = (slug, metaType) => {
  if (metaType === 'widget') {
    return metadataWidgetRequest.get(slug);
  }

  return metadataRequest.get(slug);
};

export default {
  getMetadata,
};
