import { GFW_DATA_API, GFW_METADATA_API } from 'utils/apis';
import axios from 'axios';

import METADATA_LIST from '../../../data/metadata.json';
import METADATA_EXCEPTION_LIST from '../../../data/metadata-exception.json'; // a list of metadatas that aren't on Data API

export default async (req, res) => {
  try {
    const userPath = req.query.params[0];
    const isSafePath =
      METADATA_LIST.includes(userPath) ||
      METADATA_EXCEPTION_LIST.includes(userPath);
    const isExternalMetadata = METADATA_EXCEPTION_LIST.includes(userPath);

    if (!isSafePath) {
      return res.status(400).end('Invalid path');
    }

    if (isExternalMetadata) {
      const url = `${GFW_METADATA_API}/${userPath}`;
      const response = await axios.get(url);
      const transformedResponse = {
        metadata: response.data,
      };

      return res.status(200).json(transformedResponse);
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
    return res.status(400).end(error.message);
  }
};
