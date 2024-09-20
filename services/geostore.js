import { apiRequest } from 'utils/request';

import { getDatasetQuery, getDatasetGeostore } from 'services/datasets';

import BBOXS from 'data/bboxs.json';

const LARGE_ISOS = ['USA', 'RUS', 'CAN', 'CHN', 'BRA', 'IDN', 'AUS'];

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

export const getGeostoreOLD = ({ type, adm0, adm1, adm2, token }) => {
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

      console.log('GEOSTORE', geostore);
      return {
        ...geostore,
        id: geostore?.hash,
        bbox: BBOXS[adm0] || geostore?.bbox,
      };
    });
};

export const getGeostore = ({ type, adm0, token }) => {
  if (!type || !adm0) return null;

  // const id = adm2 || adm1 || adm0; // We still need to implement other adm levels, this commit is just for testing adm0

  return getDatasetQuery({
    dataset: 'gadm_administrative_boundaries',
    sql: `SELECT country, gfw_bbox, gfw_area__ha, gfw_geostore_id, gfw_geojson, encode(ST_AsTWKB(ST_SimplifyPreserveTopology(ST_RemoveRepeatedPoints(geom, 0.001), 0.001)), 'base64') FROM data AS simplified_encoded_twkb WHERE adm_level='0' and gid_0='${adm0}'`,
    version: 'v4.1',
    token,
  }).then((data) => {
    const { gfw_bbox, gfw_geostore_id, gfw_area__ha, gfw_geojson } = data?.[0];

    return {
      areaHa: gfw_area__ha,
      id: gfw_geostore_id,
      bbox: BBOXS[adm0] || gfw_bbox,
      geojson: gfw_geojson,
    };
  });
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
