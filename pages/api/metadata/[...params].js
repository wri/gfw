import { GFW_DATA_API, GFW_STAGING_DATA_API } from 'utils/apis';
import axios from 'axios';

const ENVIRONMENT = process.env.NEXT_PUBLIC_RW_FEATURE_ENV;
const GFW_METADATA_API_URL =
  ENVIRONMENT === 'staging' ? GFW_STAGING_DATA_API : GFW_DATA_API;

export default async (req, res) => {
  try {
    // const path = req.query.params.join('/');
    // const url = `${GFW_METADATA_API_URL}/${path}`; // ${path}
    const url = `${GFW_METADATA_API_URL}/dataset/birdlife_endemic_bird_areas`;
    const datasetMetadata = await axios.get(url);
    // const datasetVersionMetadata = await axios.get(`${url}/latest/metadata`);
    const datasetVersionMetadata = await axios.get(
      `${GFW_METADATA_API_URL}/dataset/gfw_integrated_alerts/v20240605/metadata`
    );

    const response = {
      ...datasetMetadata.data.data,
      metadata: {
        ...datasetMetadata.data.data.metadata,
        ...datasetVersionMetadata.data.data,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    if (error.response) {
      return res.status(400).end(error.response.data.message);
    }

    return res.status(400).end(error.message);
  }
};
