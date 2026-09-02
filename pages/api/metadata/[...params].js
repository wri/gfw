import { GFW_DATA_API, GFW_METADATA_API } from 'utils/apis';
import { isValidMetadataKey } from 'utils/metadata';
import axios from 'axios';

import METADATA_EXCEPTION_LIST from '../../../data/metadata-exception.json'; // a list of metadata that isn't on Data API

export default async (req, res) => {
  try {
    const { params } = req.query;

    if (!Array.isArray(params) || params.length !== 1) {
      return res.status(400).json({ error: 'Invalid path parameter' });
    }

    const userPath = params[0];

    if (!isValidMetadataKey(userPath)) {
      return res.status(400).json({ error: 'Invalid path parameter' });
    }
    const isExternalMetadata = METADATA_EXCEPTION_LIST.includes(userPath);

    if (isExternalMetadata) {
      const url = `${GFW_METADATA_API}/${userPath}`;
      const response = await axios.get(url);
      if (response.data?.error) {
        return res.status(404).json({ error: response.data.error });
      }

      const transformedResponse = {
        metadata: response.data,
      };

      return res.status(200).json(transformedResponse);
    }

    const url = `${GFW_DATA_API}/dataset/${userPath}`;

    const datasetMetadata = await axios.get(url);
    let datasetVersionMetadata;

    try {
      datasetVersionMetadata = await axios.get(`${url}/latest/metadata`);
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error;
      }
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
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Metadata not found' });
    }

    return res.status(502).json({ error: error.message });
  }
};
