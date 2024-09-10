import { GFW_DATA_API, GFW_STAGING_DATA_API } from 'utils/apis';
import axios from 'axios';

const ENVIRONMENT = process.env.NEXT_PUBLIC_RW_FEATURE_ENV;
const GFW_METADATA_API_URL =
  ENVIRONMENT === 'staging' ? GFW_STAGING_DATA_API : GFW_DATA_API;

export default async (req, res) => {
  try {
    const path = req.query.params.join('/');
    const url = `${GFW_METADATA_API_URL}/${path}`;
    const datasetMetadata = await axios.get(url);
    const datasetVersionMetadata = await axios.get(`${url}/latest/metadata`);

    const dataVersionMetadataObject = datasetVersionMetadata.data.data;

    const response = {
      ...datasetMetadata.data.data,
      metadata: {
        ...datasetMetadata.data.data.metadata,
      },
    };

    /*
     * Merging the metadata from the second request
     * avoiding overwrite the object properties with null value
     */
    Object.keys(dataVersionMetadataObject).forEach((key) => {
      if (dataVersionMetadataObject[key] !== null) {
        response.metadata[key] = dataVersionMetadataObject[key];
      }
    });

    return res.status(200).json(response);
  } catch (error) {
    if (error.response) {
      return res.status(400).end(error.response.data.message);
    }

    return res.status(400).end(error.message);
  }
};
