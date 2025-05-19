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
 * @param {Object} request.aoi - area of interest.
 * @param {'global' | 'admin' | 'geostore'} request.aoi.type - type of aoi.
 * @param {string} request.aoi.geostore_id - a geostore id.
 * @param {string} request.aoi.country - country.
 * @param {string} request.aoi.region - region.
 * @param {string} request.aoi.subregion - subregion.
 * @param {number} request.canopy - canopy filter.
 * @returns {Promise<GetResponseObject | NotFoundObject>} response.
 */
const getDataByParams = async ({ dataset, aoi, canopy }) => {
  const url = `/v0/land/${dataset}`;

  const params = {
    canopy_cover: canopy,
    aoi: {
      type: aoi.type,
      ...(aoi.type === 'geostore' && {
        geostore_id: aoi.geostore_id,
      }),
      ...(aoi.type !== 'geostore' && {
        country: aoi.country,
        region: aoi.region,
        subregion: aoi.subregion,
      }),
    },
    dataset_version: { // TODO: these hardcoded params will be removed soon since they'll be default after the TCL release, ask Daniel Mannarino
      umd_tree_cover_density_2000: 'v1.8',
      umd_tree_cover_loss: 'v1.12',
      wri_google_tree_cover_loss_drivers: 'v1.12',
    }
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
 * @param {number} request.canopy - canopy filter.
 * @param {Object} request.aoi - area of interest.
 * @param {string} request.aoi.geostore_id - a geostore id.
 * @param {string} request.aoi.type - type of aoi.
 * @param {string} request.aoi.country - country.
 * @param {string} request.aoi.region - region.
 * @param {string} request.aoi.subregion - subregion.
 * @returns {Promise<GetResponseObject>} response.
 */
const createRequestByParams = async ({
  dataset,
  canopy,
  aoi,
}) => {
  const url = `/v0/land/${dataset}`;

  const params = {
    canopy_cover: canopy,
    aoi: {
      type: aoi.type,
      ...(aoi.type === 'geostore' && {
        geostore_id: aoi.geostore_id,
      }),
      ...(aoi.type !== 'geostore' && {
        country: aoi.country,
        region: aoi.region,
        subregion: aoi.subregion,
      }),
    },
    dataset_version: { // TODO: these hardcoded params will be removed soon since they'll be default after the TCL release, ask Daniel Mannarino
      umd_tree_cover_density_2000: 'v1.8',
      umd_tree_cover_loss: 'v1.12',
      wri_google_tree_cover_loss_drivers: 'v1.12',
    }
  };

  const response = await dataRequest.post(url, params);

  return response;
};

/**
 * 3
 * @param {Object} request - request
 * @param {string} request.url - url
 * @param {boolean} request.isDownload -- isDownload
 * @returns {Promise<GetResponseObject>} response.
 */
const getDataFromLink = async ({ url, isDownload }) => {
  if (isDownload) {
    return `${window.location.origin}/api/data${url.replace(
      DATA_API_URL,
      ''
    )}/?datamart-csv=true`;
  }

  return dataRequest.get(url.replace(DATA_API_URL, ''));
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 *
 * @param {function} fn
 * @param {Object} params
 * @param {number} retries
 * @param {number} interval
 * @param {string} finalErr
 * @returns
 */
const retryRequest = async (
  fn,
  params,
  retries = 15,
  interval = 2000,
  finalErr = 'Retry failed'
) => {
  try {
    const response = await fn(params);

    // Check if the response has a pending status
    if (response?.data?.status === 'pending') {
      if (retries <= 0) {
        // no more retries left
        return Promise.reject(new Error(finalErr));
      }

      // Wait for the specified interval before retrying
      await wait(interval);

      // Recursively call retryRequest with one less retry
      return retryRequest(fn, params, retries - 1, interval, finalErr);
    }

    // If status is not pending, return the successful response
    return response;
  } catch (error) {
    if (retries <= 0) {
      return Promise.reject(error);
    }

    // Wait for the specified interval before retrying
    await wait(interval);

    // Recursively call retryRequest with one less retry
    return retryRequest(fn, params, retries - 1, interval, finalErr);
  }
};

/**
 *
 * @param {Object} request
 * @param {string} request.dataset - dataset
 * @param {string} request.geostoreId - geostore id
 * @param {'admin' | 'geostore' | 'global'} request.type type of request, admin when analysis = true in widget params
 * @param {string} request.adm0 - adm0, iso code i.e. BRA, MEX
 * @param {string} request.adm1 - adm1 region
 * @param {string} request.adm2 - adm2 subregion
 * @param {number} request.threshold - canopy threshold
 * @param {boolean} request.isDownload - whether the query is is download
 * @param {number} request.retries - this parameter is to manage retries (only for recursion)
 */
export const fetchDataMart = async ({
  dataset,
  geostoreId,
  type,
  adm0,
  adm1,
  adm2,
  threshold,
  isDownload,
  // eslint-disable-next-line no-unused-vars
  retries,
}) => {
  const response = await getDataByParams({
    dataset,
    canopy: threshold,
    aoi: {
      type,
      geostore_id: geostoreId,
      country: adm0,
      region: adm1,
      subregion: adm2,
    },
  });
  if (response.status !== 404) {
    // link exists, need to fetch
    const existing = await retryRequest(getDataFromLink, {
      url: response.link,
      isDownload,
    });

    return existing;
  }

  // make post to create the data in back end
  const submitted = await createRequestByParams({
    dataset,
    canopy: threshold,
    aoi: {
      type,
      country: adm0,
      region: adm1,
      subregion: adm2,
      geostore_id: geostoreId,
    },
  });

  // retry based on secondTry.headers['retry-after]
  const secondTry = await retryRequest(getDataFromLink, {
    url: submitted.data.link,
    isDownload,
  });

  return secondTry;
};
