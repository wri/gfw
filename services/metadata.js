import { metadataRequest, newMetadataRequest } from 'utils/request';

const TCL_NEW_METADATA_ENDPOINT = [
  'gfw_emerging_hot_spots_v2023',
  'tsc_tree_cover_loss_drivers_v2023',
];

export const getMetadata = (slug) => {
  if (TCL_NEW_METADATA_ENDPOINT.includes(slug)) {
    return newMetadataRequest.get(slug);
  }

  return metadataRequest.get(slug);
};

export default {
  getMetadata,
};
