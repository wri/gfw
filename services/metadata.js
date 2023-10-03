import { metadataRequest, rwRequest } from 'utils/request';

export const getMetadata = (slug, metaType) => {
  if (metaType === 'widget') {
    return rwRequest.get(`widget/${slug}`)
    .then((resp) => {
      const dataset = resp.data?.dataset;
      return rwRequest.get(`dataset/${dataset}/widget/${slug}/metadata`)
    })
  }
  
  return metadataRequest.get(slug);
}

export default {
  getMetadata,
};
