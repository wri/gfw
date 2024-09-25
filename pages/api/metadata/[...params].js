import { GFW_DATA_API } from 'utils/apis';
import axios from 'axios';

import METADATA_LIST from '../../../data/metadata.json';

export default async (req, res) => {
  try {
    const userPath = req.query.params[1];
    const safePath = METADATA_LIST.includes(userPath);

    if (!safePath) {
      return res.status(400).end('Invalid path');
    }

    const url = `${GFW_DATA_API}/dataset/${userPath}`;

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
