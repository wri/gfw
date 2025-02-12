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
 * Push the parameters from the area clicked to the URL query
 * @param {string} url - Url with the Resource Watch endpoint
 * @param {string} token - Optional token for axios cancelToken
 * @return {object} - An object with geojson and bbox objects and area id
 *
 */
const fetchGeostore = ({ url, token }) =>
  dataRequest
    .get(`https://data-api.globalforestwatch.org/${url}`, {
      cancelToken: token,
    })
    .then((response) => {
      const { attributes: geostore } = response?.data || {};
      console.log('RESPONSE', response?.data);

      return {
        geojson: geostore?.geojson,
        id: geostore?.hash,
        bbox: geostore?.bbox,
      };
    });

export const getGeostore = ({ type, adm0, adm1, adm2, token }) => {
  if (!type || !adm0) return null;

  const adminURL = `/geostore/admin/${adm0}${adm1 ? `/${adm1}` : ''}${
    adm2 ? `/${adm2}` : ''
  }`;

  switch (type) {
    case 'country':
      return fetchGeostore({
        url: adminURL,
        token,
      });
    case 'use':
      return fetchGeostore({
        url: `/geostore/use/${adm0}${adm1 ? `/${adm1}` : ''}`,
        token,
      });
    case 'geostore':
      return fetchGeostore({
        url: `/geostore/use/${adm0}`,
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
