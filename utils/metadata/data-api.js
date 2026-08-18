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
 *
 * The optional latest-version metadata request is handled the same way, but
 * more narrowly: a 404 there just means this dataset has no latest-version
 * metadata, which is expected and tolerated — dataset-level metadata is
 * still returned on its own, and this does NOT count as the key being
 * "not found" (the dataset itself was found; only an optional extra
 * document is missing), so it never triggers Resource Watch fallback. Any
 * other failure on that request (5xx, timeout, auth) is a genuine upstream
 * problem and is propagated rather than silently swallowed.
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
    if (error.response?.status === 404) {
      datasetVersionMetadata = { data: { data: {} } };
    } else {
      throw error;
    }
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
