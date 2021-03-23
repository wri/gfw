import { apiRequest } from 'utils/request';

import { getDatasetQuery, getDatasetGeostore } from 'services/datasets';

import BBOXS from 'data/bboxs.json';

const ENVIRONMENT = process.env.NEXT_PUBLIC_FEATURE_ENV;

const LARGE_ISOS = ['USA', 'RUS', 'CAN', 'CHN', 'BRA', 'IDN', 'AUS'];

const getWDPAGeostore = ({ id, token }) =>
  getDatasetQuery({
    dataset: 'wdpa_protected_areas',
    sql: `SELECT gfw_geostore_id FROM data WHERE wdpaid = '${id}'`,
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
        geojson: gfw_geojson,
        areaHa: gfw_area__ha,
        bbox: gfw_bbox,
      };
    })
  );

export const getGeostore = ({ type, adm0, adm1, adm2, token }) => {
  if (!type || !adm0) return null;

  let thresh = adm1 ? 0.0005 : 0.005;
  let url = '/v2/geostore';

  switch (type) {
    case 'country':
      thresh = LARGE_ISOS.includes(adm0) ? 0.05 : 0.005;
      url = url.concat(
        `/admin/${adm0}${adm1 ? `/${adm1}` : ''}${adm2 ? `/${adm2}` : ''}`
      );
      break;
    case 'use':
      url = url.concat(`/use/${adm0}/${adm1}`);
      break;
    case 'geostore':
      url = url.concat(`/${adm0}`);
      break;
    case 'wdpa':
      return getWDPAGeostore({
        id: adm0,
        token,
      });
    default:
      return false;
  }

  return apiRequest
    .get(`${url}?thresh=${thresh}`, { cancelToken: token })
    .then((response) => {
      const { attributes: geostore } = response?.data?.data || {};

      return {
        ...geostore,
        id: geostore?.hash,
        bbox: BBOXS[adm0] || geostore?.bbox,
      };
    });
};

export const saveGeostore = (geojson, onUploadProgress, onDownloadProgress) =>
  apiRequest({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data: {
      geojson,
    },
    url: ENVIRONMENT === 'staging' ? '/v1/geostore' : '/geostore',
    onUploadProgress,
    onDownloadProgress,
  });
