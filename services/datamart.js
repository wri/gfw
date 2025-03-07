import qs from 'qs';
import { dataRequest } from 'utils/request';

/**
 * @typedef {object} DataLinkObject
 * @property {string} link - The URL to POST the content.
 */

/**
 * @typedef {object} GetResponseObject
 * @property {string} status - status.
 * @property {DataLinkObject} data - data link object.
 */

/**
 * @typedef {object} NotFoundObject
 * @property {string} status - status.
 * @property {string} message - message.
 */

/**
 * 1
 * @param {Object} request - request
 * @param {string} request.dataset - dataset.
 * @param {string} request.geostoreId - a geostore id.
 * @param {number} request.canopy - canopy filter.
 * @returns {Promise<GetResponseObject | NotFoundObject>} response.
 */
export const getDataByGeostoreId = async ({ dataset, geostoreId, canopy }) => {
  const url = `/v0/land/${dataset}`;
  const params = {
    geostore_id: geostoreId,
    canopy_cover: canopy,
  };

  const requestUrl = `${url}/?${qs.stringify(params)}`;

  let response;

  try {
    response = await dataRequest.get(requestUrl);
  } catch (error) {
    if (error.response?.status === 404) {
      return new Promise((resolve) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        resolve({
          status: error.response?.status,
          message: error.response?.statusText,
        });
      });
    }
  }

  return response.data;
};

/**
 * 2
 * @param {Object} request - request
 * @param {string} request.dataset - dataset.
 * @param {string} request.geostoreId - a geostore id.
 * @param {number} request.canopy - canopy filter.
 * @returns {Promise<GetResponseObject>} response.
 */
export const createRequestByGeostoryId = async ({
  dataset,
  geostoreId,
  canopy,
}) => {
  const url = `/v0/land/${dataset}`;
  const params = {
    geostore_id: geostoreId,
    canopy_cover: canopy,
  };

  const response = await dataRequest.post(url, params);

  return response;
};

/**
 * 3
 * @param {Object} request - request
 * @param {string} request.url - url
 * @returns {Promise<GetResponseObject>} response.
 */
export const getDataFromLink = ({ url }) => {
  return dataRequest.get(url);
};
