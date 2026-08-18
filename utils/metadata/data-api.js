import axios from 'axios';

import { GFW_DATA_API } from 'utils/apis';
import { MetadataNotFoundError } from './errors';

/**
 * Resolves metadata for a key against the GFW Data API.
 *
 * Preserves the existing Data API semantics: fetch the dataset, fetch its
 * latest-version metadata, and merge the latter over the former without
 * overwriting properties with a null value.
 *
 * Throws MetadataNotFoundError when the Data API reports the dataset itself
 * doesn't exist (404). Any other failure (network error, 5xx, etc.) is
 * rethrown as-is so callers can tell "not found" apart from "upstream is
 * broken".
 */
export const getDataApiMetadata = async (key) => {
  const url = `${GFW_DATA_API}/dataset/${key}`;

  let datasetMetadata;
  try {
    datasetMetadata = await axios.get(url);
  } catch (error) {
    if (error.response?.status === 404) {
      throw new MetadataNotFoundError(
        `No Data API metadata found for "${key}"`
      );
    }
    throw error;
  }

  let datasetVersionMetadata;
  try {
    datasetVersionMetadata = await axios.get(`${url}/latest/metadata`);
  } catch (error) {
    // A missing (or otherwise failing) latest-version metadata document is
    // currently tolerated: dataset-level metadata is still returned.
    // Distinguishing "latest metadata doesn't exist" from "latest metadata
    // request failed" is a deliberate follow-up improvement, kept separate
    // from this extraction so it doesn't bundle a behavior change in with a
    // refactor.
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
    Object.keys(dataVersionMetadataObject).forEach((versionKey) => {
      if (dataVersionMetadataObject[versionKey] !== null) {
        response.metadata[versionKey] = dataVersionMetadataObject[versionKey];
      }
    });
  }

  return response;
};
