import qs from 'qs';
import { dataRequest } from 'utils/request';
import { GFW_DATA_API, GFW_STAGING_DATA_API } from 'utils/apis';

const ENVIRONMENT = process.env.NEXT_PUBLIC_FEATURE_ENV;
const DATA_API_URL =
  ENVIRONMENT === 'staging' ? GFW_STAGING_DATA_API : GFW_DATA_API;

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
const getDataByGeostoreId = async ({ dataset, geostoreId, canopy }) => {
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
const createRequestByGeostoryId = async ({
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
const getDataFromLink = async ({ url }) => {
    return dataRequest.get(url.replace(DATA_API_URL, ''));
};


const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryRequest = async (fn, params, retries = 3, interval = 1000, finalErr = 'Retry failed') => {
  try {
    console.log(`retryRequest retries ${retries} with fn ${fn}`);
    const res = await fn(params);

    if (res.data?.status === 'pending') {
      console.log(`is pending, waiting ${interval} sec and retrying`);
      await wait(interval);
      return retryRequest(fn, params, retries - 1, interval, finalErr);
    }

    return res;

  } catch (err) {
    console.log('caught err: ', err);
    if (retries <= 0) {
      console.log('no more retries, rejecting');
      return Promise.reject(finalErr);
    }
    await wait(interval);
    return retryRequest(fn, params, retries - 1, interval, finalErr);
  }
};

/**
 * 
 * @param {Object} request
 * @param {string} request.dataset - dataset
 * @param {string} request.geostoreId - geostore id
 * @param {boolean} request.isGlobal - whether the query is global or not
 * @param {string} request.adm0 - adm0
 * @param {string} request.adm1 - adm1
 * @param {string} request.adm2 - adm2
 * @param {boolean} request.isAnalyis - is analysis
 * @param {number} request.threshold - canopy threshold
 * @param {boolean} request.isDownload - whether the query is is download
 * @param {number} request.retries - this parameter is to manage retries (only for recursion)
 * @param 
 */
export const fetchDataMart = async ({
  dataset,
  geostoreId,
  isGlobal,
  adm0,
  adm1,
  adm2,
  isAnalyis,
  threshold,
  isDownload,
  retries,
}) => {
  const response = await getDataByGeostoreId({ dataset, geostoreId, canopy: threshold });

  if (response.status !== 404) {
    console.log('link exists, need to fetch: ', response.link);
    const existing = await retryRequest(getDataFromLink, { url: response.link });
    console.log('existing: ', existing);
  } else {
    // make post to create the data in back end
    console.log('make post to create the data in back end');
    const submitted = await createRequestByGeostoryId({ dataset, geostoreId, canopy: threshold });
    console.log('> submitted: ', submitted);

    // get link and fetch

    // retry based on secondTry.headers['retry-after]
    const secondTry = await retryRequest(getDataFromLink, { url: submitted.data.link });

    console.log('secondTry: ', secondTry);
  }

};
