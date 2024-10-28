import { apiRequest } from 'utils/request';

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
 * This method must be removed as soon as we migrate the other cases for geGeostore method.
 *
 */
const fetchGeostoreFromRWApi = ({ url, token }) =>
  apiRequest
    .get(`${url}?thresh=0.005`, { cancelToken: token })
    .then((response) => {
      const { attributes: geostore } = response?.data?.data || {};

      return {
        geojson: geostore?.geojson,
        id: geostore?.hash,
        bbox: geostore?.bbox,
      };
    });

const fetchGeostoreFromDataApi = ({ adm0, adm1, adm2, token }) => {
  const COUNTRY = adm0 ? `gid_0='${adm0}'` : '';
  const REGION = adm1 ? ` AND gid_1 LIKE '${adm0}.${adm1}__'` : '';
  const SUBREGION = adm2 ? ` AND gid_2 LIKE '${adm0}.${adm1}.${adm2}__'` : '';

  const admLevel = (adm1 && adm2 ? 2 : 1) || 0;
  const query = `SELECT gfw_bbox, gfw_geostore_id,
    ST_AsGeoJSON(ST_SimplifyPreserveTopology(ST_RemoveRepeatedPoints(geom, 0.001), 0.001)) AS gfw_geojson
    FROM gadm_administrative_boundaries WHERE adm_level='${admLevel}' AND ${COUNTRY}${REGION}${SUBREGION} limit 1`;

  return getDatasetQuery({
    dataset: 'gadm_administrative_boundaries',
    sql: query,
    version: 'v4.1',
    token,
  }).then((data) => {
    const { gfw_bbox, gfw_geostore_id, gfw_geojson } = data?.[0];
    const parsed_gfw_geojson = JSON.parse(gfw_geojson);

    return {
      id: gfw_geostore_id,
      bbox: gfw_bbox,
      geojson: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              ...parsed_gfw_geojson,
            },
          },
        ],
      },
    };
  });
};

export const getGeostore = ({ type, adm0, adm1, adm2, token }) => {
  if (!type || !adm0) return null;
  // console.log('type', type)
  // console.log('adm0', adm0)
  // console.log('adm1', adm1)
  // console.log('adm2', adm2)
  // console.log('token', token)
  switch (type) {
    case 'country':
      return fetchGeostoreFromDataApi({
        adm0,
        adm1,
        adm2,
        token,
      });
    case 'use':
      return fetchGeostoreFromRWApi({
        url: `/v2/geostore/use/${adm0}/${adm1}`,
        token,
      });
    case 'geostore':
      return fetchGeostoreFromRWApi({
        url: `/v2/geostore/use/${adm0}`,
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
