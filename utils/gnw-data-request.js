import axios from 'axios';

/**
 * Determines if the current environment is server-side (Node.js).
 * @returns {boolean} True if running on the server, false if in the browser.
 */
const isServer = () => typeof window.document === 'undefined';

/**
 * Default Axios request configuration.
 * @type {object}
 */
const defaultRequestConfig = {
  timeout: 30 * 1000,
};

/**
 * Formats the analytics response to match legacy expectations.
 * @param {object} data - The raw analytics response data.
 * @param {object} aoi - The AOI with the geostore and geojson.
 * @returns {object} The formatted response data.
 */
export const formatLegacyResponse = (data, aoi) => {
  const { result } = data;
  const years = result.tree_cover_loss_year || [];
  const natural_forest_classes = result.natural_forests_class || [];
  const area = result.area_ha || [];
  const emissions = result.carbon_emissions_MgCO2e || [];
  const status = data.status === 'saved' ? 'success' : data.status;

  const formatted = years
    .map((year, i) => ({
      geostore__id: aoi.id,
      sbtn_natural_forests__class: natural_forest_classes[i],
      umd_tree_cover_loss__year: year,
      umd_tree_cover_loss__ha: area[i] || null,
      gfw_gross_emissions_co2e_all_gases__mg: emissions ? emissions[i] : null,
      area: area[i] || null,
      emissions: emissions ? emissions[i] : null,
      year,
    }))
    .sort((a, b) => a.year - b.year);

  return {
    status,
    data: {
      data: formatted,
    },
  };
};

/**
 * Creates an Axios HTTP client for the analytics API.
 * Uses different base URLs for server and client environments.
 * @returns {import('axios').AxiosInstance} Configured Axios instance.
 */
const createHttpClient = () => {
  const dataMartRequest = axios.create({
    ...defaultRequestConfig,
    ...(isServer() && {
      baseURL: 'https://analytics.globalnaturewatch.org',
    }),
    ...(!isServer() && {
      baseURL: '/api/gnw-analytics',
    }),
    transformResponse: [(data) => JSON.parse(data)?.data],
  });
  return dataMartRequest;
};

/**
 * Builds the payload for the analytics job request.
 * @param {object} aoi - Area of interest, with geostore properties.
 * @param {object} timespan - Object with startYear and endYear properties.
 * @param {number} canopyCoverThreshold - Minimum canopy cover threshold.
 * @returns {object} The payload for the analytics API.
 */
export const buildPayload = (aoi) => {
  aoi.geostore.geojson.features[0].id = aoi.geostore.id;
  const payload = {
    aoi: {
      type: 'feature_collection',
      feature_collection: aoi.geostore.geojson,
    },
    start_year: '2021',
    end_year: '2024',
    forest_filter: 'natural_forest',
    intersections: [],
  };
  return payload;
};

/**
 * Initiates an analytics job by posting the payload to the API.
 * @param {import('axios').AxiosInstance} dataMartRequest - Axios client instance.
 * @param {object} payload - Analytics job payload.
 * @returns {Promise<string>} The resource ID for the analytics job.
 * @throws Will throw if the job initiation fails.
 */
const initiateAnalyticsJob = async (dataMartRequest, payload) => {
  const postRes = await dataMartRequest.post(
    '/v0/land_change/tree_cover_loss/analytics',
    payload
  );

  if (postRes.status !== 202 || postRes?.data?.status === 'failed') {
    throw new Error('Failed to initiate analytics job');
  }

  const { link } = postRes.data;
  return link.split('/').pop();
};

/**
 * Polls the analytics API for job completion and retrieves the result.
 * @param {import('axios').AxiosInstance} dataMartRequest - Axios client instance.
 * @param {string} resourceId - Resource ID of the analytics job.
 * @returns {Promise<object>} The completed analytics job data.
 * @throws Will throw if the job fails or remains pending.
 */
const getAnalyticsResource = async (dataMartRequest, resourceId) => {
  let totalWait = 0;
  const maxWait = 30; // seconds

  // First GET immediately
  let getRes = await dataMartRequest.get(
    `/v0/land_change/tree_cover_loss/analytics/${resourceId}`
  );
  let { status } = getRes.data;

  // Poll if status is pending
  while (status === 'pending' && totalWait < maxWait) {
    const retryAfter = parseInt(getRes.headers['retry-after'] || '1', 10);

    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
    totalWait += retryAfter;

    // eslint-disable-next-line no-await-in-loop
    getRes = await dataMartRequest.get(
      `/v0/land_change/tree_cover_loss/analytics/${resourceId}`
    );
    status = getRes.data.status;
  }

  if (status === 'failed' || status === 'pending') {
    throw new Error('Analytics job failed or stuck in pending');
  }

  return getRes.data;
};

/**
 * Orchestrates the analytics job: builds payload, initiates job, polls for result, and formats response.
 * @param {object} aoi - Area of interest, with adm0, adm1, adm2 properties.
 * @param {object} timespan - Object with startYear and endYear properties.
 * @param {number} canopyCoverThreshold - Minimum canopy cover threshold.
 * @returns {Promise<object>} The formatted analytics result.
 */
export const getTreeCoverLossAnalytics = async (
  aoi,
  timespan, // eslint-disable-line no-unused-vars
  canopyCoverThreshold // eslint-disable-line no-unused-vars
) => {
  const dataMartRequest = createHttpClient();
  const payload = buildPayload(aoi);
  const resourceId = await initiateAnalyticsJob(dataMartRequest, payload);
  const analyticsData = await getAnalyticsResource(dataMartRequest, resourceId);
  return formatLegacyResponse(analyticsData, aoi);
};
