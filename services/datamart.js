import axios from 'axios';
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
 * @param {string} request.geostoreId - a geostore id.
 * @param {number} request.canopy - canopy filter.
 * @returns {Promise<GetResponseObject | NotFoundObject>} response.
 */
export const getDataByGeostoreId = async ({ geostoreId, canopy }) => {
  // TODO: receive url as a param (or at least the dataset)
  const url = '/v0/land/tree-cover-loss-by-driver';
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
 * @param {string} request.geostoreId - a geostore id.
 * @param {number} request.canopy - canopy filter.
 * @returns {Promise<GetResponseObject>} response.
 */
export const createRequestByGeostoryId = async ({ geostoreId, canopy }) => {
  // TODO: receive url as a param (or at least the dataset)
  const url = '/v0/land/tree-cover-loss-by-driver';
  const params = {
    geostore_id: geostoreId,
    canopy_cover: canopy,
  };

  console.log('POSTing...');
  const response = await dataRequest.post(url, params);

  return response;
};

const DATA_API_KEY = process.env.NEXT_PUBLIC_GFW_API_KEY;
/**
 * 3
 * @param {Object} request - request
 * @param {string} request.url - url
 * @returns {Promise<GetResponseObject>} response.
 */
export const getDataFromLink = async ({ url }) => {

  console.log('> getDataFromLink: ', url)
  try {
  const response = await axios.create({
    timeout: 30 * 1000,
    headers: {
      'x-api-key': DATA_API_KEY,
    },
    transformResponse: [(data) => JSON.parse(data)?.data],
  }).get(url);
  console.log('>> getDataFromLink response: ', response);
  return response;
  } catch (error) {
    console.log('> err: ', error);
    throw error;
  }
};
