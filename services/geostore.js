import { apiRequest, dataRequest } from 'utils/request';

import { getDatasetQuery, getDatasetGeostore } from 'services/datasets';

const getWDPAGeostore = ({ id, token }) =>
  getDatasetQuery({
    dataset: 'wdpa_protected_areas',
    sql: `SELECT gfw_geostore_id, name, marine::int, status, status_yr FROM data WHERE wdpaid = '${id}'`,
    token,
  }).then((data) =>
    getDatasetGeostore({
      dataset: 'wdpa_protected_areas',
      geostoreId: data?.[0]?.gfw_geostore_id,
      token,
    }).then((geostore) => {
      const { gfw_geojson, gfw_area__ha, gfw_bbox } = geostore;
      return {
        id: data?.[0]?.gfw_geostore_id,
        location: data?.[0],
        geojson: gfw_geojson,
        areaHa: gfw_area__ha,
        bbox: gfw_bbox,
      };
    })
  );

/**
 * Calculate the threshold for geostore endpoint
 * Big countries has a different threshold. eg. Brazil
 * @param {string} iso - admin level 0 (e.g BRA)
 * @param {string} adm1 - admin level 1 (e.g 25)
 * @param {string} adm2 - admin level 2 (e.g 390)
 * @return {number} - threshold value
 *
 */
const setThreshold = (iso, adm1, adm2) => {
  const bigCountries = ['USA', 'RUS', 'CAN', 'CHN', 'BRA', 'IDN'];
  const baseThresh = bigCountries.includes(iso) ? 0.1 : 0.005;
  if (iso && !adm1 && !adm2) {
    return baseThresh;
  }
  return adm1 && !adm2 ? baseThresh / 10 : baseThresh / 100;
};

/**
 * Fetch geostore from Data API
 * @param {string} url - geostore path e.g /geostore/admin/BRA/25/390
 * @param {string} token - Optional token for axios cancelToken
 * @param {string} queryParams - Optional query parameters
 * @return {object} - An object with area id, geojson and bbox objects
 *
 * @deprecated This method must be removed as soon as we migrate the other scenarios for geGeostore method.
 */
const fetchGeostore = ({ url, token, queryParams = '' }) => {
  return dataRequest
    .get(`https://data-api.globalforestwatch.org${url}?${queryParams}`, {
      cancelToken: token,
    })
    .then((response) => {
      const { attributes: geostore } = response?.data || {};

      return {
        geojson: geostore?.geojson,
        id: geostore?.hash,
        bbox: geostore?.bbox,
      };
    });
};

export const getGeostore = ({ type, adm0, adm1, adm2, token }) => {
  if (!type || !adm0) return null;

  const sourceProvider = 'source[provider]=gadm';
  const sourceVersion = 'source[version]=3.6';
  const threshold = `simplify=${setThreshold(adm0, adm1, adm2)}`;
  const queryParams = `${sourceProvider}&${sourceVersion}`;

  switch (type) {
    case 'country':
      return fetchGeostore({
        url: `/geostore/admin/${adm0}${adm1 ? `/${adm1}` : ''}${adm2 ? `/${adm2}` : ''
          }`,
        queryParams: `${queryParams}&${threshold}`,
        token,
      });
    case 'use':
      return fetchGeostore({
        url: `/geostore/use/${adm0}/${adm1}`,
        queryParams,
        token,
      });
    case 'geostore':
      return fetchGeostore({
        url: `/geostore/${adm0}`,
        queryParams,
        token,
      });
    case 'wdpa':
      return getWDPAGeostore({
        id: adm0,
        token,
      });
    default:
      return false;
  }
};

export const saveGeostore = (geojson, onUploadProgress, onDownloadProgress) => {
  return apiRequest({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data: {
      geojson,
    },
    url: '/geostore/',
    onUploadProgress,
    onDownloadProgress,
  });
};
