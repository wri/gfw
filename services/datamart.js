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
 * @param {Object} request.aoi - area of interest.
 * @param {Object} request.aoi.type - type of aoi.
 * @param {string} request.aoi.country - country.
 * @param {string} request.aoi.region - region.
 * @param {string} request.aoi.subregion - subregion.
 * @returns {Promise<GetResponseObject>} response.
 */
const createRequestByParams = async ({
  dataset,
  geostoreId,
  canopy,
  aoi: {
   type,
   country,
   region,
   subregion,
  },
}) => {
  const url = `/v0/land/${dataset}`;
  const params = {
    canopy_cover: canopy,
    aoi: {
      geostore_id: geostoreId,
      type,
      country,
      region,
      subregion,
    }
  };

  const response = await dataRequest.post(url, params);
  console.log('POST response: ', response);

  return response;
};

/**
 * 3
 * @param {Object} request - request
 * @param {string} request.url - url
 * @returns {Promise<GetResponseObject>} response.
 */
const getDataFromLink = async ({ url }) => {
    // return dataRequest.get(url.replace(DATA_API_URL, ''));
  // TODO: remove this fixture with real request:
  return {
    "data":
      {
          "tree_cover_loss_by_driver":
          [
              {
                  "driver_type": "Commodity driven deforestation",
                  "loss_area_ha": 102019540.81913719
              },
              {
                  "driver_type": "Forestry",
                  "loss_area_ha": 154726798.99459094
              },
              {
                  "driver_type": "Shifting agriculture",
                  "loss_area_ha": 113153896.50346063
              },
              {
                  "driver_type": "Unknown",
                  "loss_area_ha": 2053365.653752933
              },
              {
                  "driver_type": "Urbanization",
                  "loss_area_ha": 3121266.4572304045
              },
              {
                  "driver_type": "Wildfire",
                  "loss_area_ha": 112648816.2436258
              },
          ],
          "metadata":
          {
              "geostore_id": "e35e1243-5cee-15f6-faf8-49f5d22297db",
              "sources":
              [
                  {
                      "dataset": "umd_tree_cover_loss",
                      "version": "v1.11"
                  },
                  {
                      "dataset": "tsc_tree_cover_loss_drivers",
                      "version": "v2023"
                  },
                  {
                      "dataset": "umd_tree_cover_density_2000",
                      "version": "v1.8"
                  }
              ],
              "canopy_cover": 30
          },
          "message": null,
          "status": "saved"
      },
      "status": "success"
  };
};


const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 *
 * @param {function} fn
 * @param {Object} params
 * @param {number} retries
 * @param {number} interval
 * @param {string} finalErr
 * @returns
 */
const retryRequest = async (fn, params, retries = 3, interval = 1000, finalErr = 'Retry failed') => {
  try {
    const response = await fn(params);

    console.log('response?.data?.status: ', response?.data?.status);

    // Check if the response has a pending status
    if (response?.data?.status === 'pending') {
      if (retries <= 0) {
        console.log(`no more retries left`);
        return Promise.reject(new Error(finalErr));
      }

      // Wait for the specified interval before retrying
      await wait(interval);

      // Log retry attempt (keeping consistent with existing logging pattern)
      console.log(`Retrying request, ${retries} attempts left`);

      // Recursively call retryRequest with one less retry
      return retryRequest(fn, params, retries - 1, interval, finalErr);
    }

    // If status is not pending, return the successful response
    return response;
  } catch (error) {
    if (retries <= 0) {
      console.log(`caught error, no more retries left`);
      return Promise.reject(error);
    }

    // Wait for the specified interval before retrying
    await wait(interval);

    // Log retry attempt after error
    console.log(`Request failed, retrying. ${retries} attempts left`);

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
  // eslint-disable-next-line no-unused-vars
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

  console.log('>> response: ', response);

  if (response.status !== 404) {
    console.log('link exists, need to fetch: ', response.link);
    const existing = await retryRequest(getDataFromLink, { url: response.link });
    console.log('existing: ', existing);
    return existing;
  }

    // make post to create the data in back end
    console.log('make post to create the data in back end');
    const submitted = await createRequestByParams({
      dataset,
      geostoreId,
      canopy: threshold,
      aoi: {
        type,
        country: adm0,
        region: adm1,
        subregion: adm2,
      },
    });
    console.log('> submitted: ', submitted);

    // get link and fetch

    // retry based on secondTry.headers['retry-after]
    const secondTry = await retryRequest(getDataFromLink, { url: submitted.data.link });

    console.log('secondTry: ', secondTry);
    return secondTry;
};
