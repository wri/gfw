import { GFW_DATA_API, GFW_METADATA_API } from 'utils/apis';
import axios from 'axios';

import METADATA_LIST from '../../../data/metadata.json';
import METADATA_EXCEPTION_LIST from '../../../data/metadata-exception.json'; // a list of metadata that isn't on Data API

export default async (req, res) => {
  try {
    const userPath = req.query.params[0];
    const isExternalMetadata = METADATA_EXCEPTION_LIST.includes(userPath);
    const safePaths = [...METADATA_LIST, ...METADATA_EXCEPTION_LIST].filter(
      (path) => path === userPath
    );

    if (safePaths.length === 0) {
      return res.status(400).end('Invalid path');
    }

    if (isExternalMetadata) {
      const url = `${GFW_METADATA_API}/${safePaths[0]}`;
      const response = await axios.get(url);
      const transformedResponse = {
        metadata: response.data,
      };

      return res.status(200).json(transformedResponse);
    }

    const url = `${GFW_DATA_API}/dataset/${safePaths[0]}`;

    const datasetMetadata = await axios.get(url);
    let datasetVersionMetadata;

    try {
      datasetVersionMetadata = await axios.get(`${url}/latest/metadata`);
    } catch (error) {
      datasetVersionMetadata = { data: { data: {} } };
    }
    const dataVersionMetadataObject = datasetVersionMetadata?.data?.data;

    const response = {
      ...datasetMetadata?.data?.data,
      metadata: {
        ...datasetMetadata?.data?.data?.metadata,
      },
    };

    /*
     * Merging the metadata from the second request
     * avoiding overwrite the object properties with null value
     */
    if (dataVersionMetadataObject) {
      Object.keys(dataVersionMetadataObject).forEach((key) => {
        if (dataVersionMetadataObject[key] !== null) {
          response.metadata[key] = dataVersionMetadataObject[key];
        }
      });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).end(error.message);
  }
};
