import { apiRequest } from 'utils/request';

import { getDatasetQuery, getDatasetGeostore } from 'services/datasets';

// const LARGE_ISOS = ['USA', 'RUS', 'CAN', 'CHN', 'BRA', 'IDN', 'AUS'];

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

export const getGeostore = ({ type, adm0, token }) => {
  if (!type || !adm0) return null;

  switch (type) {
    case 'use':
      break;
    case 'wdpa':
      return getWDPAGeostore({
        id: adm0,
        token,
      });
    default:
      return false;
  }

  return getDatasetQuery({
    dataset: 'gadm_administrative_boundaries',
    sql: `SELECT country, gfw_bbox, gfw_geostore_id, ST_AsGeoJSON(ST_SimplifyPreserveTopology(ST_RemoveRepeatedPoints(geom, 0.005), 0.005)) AS gfw_geojson FROM gadm_administrative_boundaries WHERE adm_level='0' AND gid_0='${adm0}' limit 1`,
    version: 'v4.1',
    token,
  }).then((data) => {
    const { gfw_bbox, gfw_geostore_id, gfw_geojson } = data?.[0];
    const parsed_gfw_geojson = JSON.parse(gfw_geojson);

    return {
      id: gfw_geostore_id,
      bbox: gfw_bbox,
      geojson: {
        crs: {},
        features: [
          {
            geometry: {
              ...parsed_gfw_geojson,
            },
            properties: null,
            type: 'Feature',
          },
        ],
        type: 'FeatureCollection',
      },
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
