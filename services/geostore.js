import { apiRequest, dataRequest } from 'utils/request';

import BOUNDS from 'data/bounds.json';
import BBOX from 'data/bbox.json';

export const getBounds = (cornerBounds, country, region) => {
  if (!region && Object.keys(BOUNDS).includes(country)) {
    return BOUNDS[country];
  }

  return [
    [cornerBounds[0], cornerBounds[1]],
    [cornerBounds[0], cornerBounds[3]],
    [cornerBounds[2], cornerBounds[3]],
    [cornerBounds[2], cornerBounds[1]],
    [cornerBounds[0], cornerBounds[1]],
  ];
};

export const getBbox = (bbox, country, region) => {
  if (!region && Object.keys(BBOX).includes(country)) {
    return BBOX[country];
  }
  return bbox;
};

export const parseGeostore = (data, params) => {
  const { adm0, adm1 } = params || {};
  const { bbox } = data || {};
  return {
    ...data,
    bbox: getBbox(bbox, adm0, adm1),
    bounds: getBounds(bbox, adm0, adm1),
  };
};

const parseGeostoreUrl = ({ type, adm0, adm1, adm2, thresh }) => {
  let slug = type !== 'geostore' ? type : '';
  if (type === 'country') slug = 'admin';

  return `/v2/geostore${slug ? `/${slug}` : ''}/${adm0}${
    adm1 ? `/${adm1}` : ''
  }${adm2 ? `/${adm2}` : ''}${`?simplify=${!adm1 ? thresh : thresh / 10}`}`;
};

export const getGeostore = ({ type, adm0, adm1, adm2, token }) => {
  let thresh = 0.005;
  if (!type || !adm0) return null;
  if (type === 'country') {
    const bigCountries = ['USA', 'RUS', 'CAN', 'CHN', 'BRA', 'IDN', 'AUS'];
    thresh = bigCountries.includes(adm0) ? 0.05 : 0.005;
  } else if (type === 'wdpa') {
    return dataRequest
      .get(
        `/dataset/wdpa_protected_areas/latest/query?sql=SELECT gfw_geostore_id FROM data WHERE wdpaid = '${adm0}'`,
        { cancelToken: token }
      )
      .then((response) => {
        const { gfw_geostore_id } = response?.data?.data?.[0];
        return dataRequest
          .get(
            `/dataset/wdpa_protected_areas/latest/geostore/${gfw_geostore_id}`,
            { cancelToken: token }
          )
          .then((geostoreResponse) => {
            const {
              gfw_geojson,
              gfw_area__ha,
              gfw_bbox,
            } = geostoreResponse?.data?.data;

            return {
              id: gfw_geostore_id,
              geojson: gfw_geojson,
              areaHa: gfw_area__ha,
              bbox: gfw_bbox,
            };
          });
      });
  }

  const url = parseGeostoreUrl({ type, adm0, adm1, adm2, thresh });

  return apiRequest.get(url, { cancelToken: token }).then((response) => {
    const { data } = response?.data;

    return parseGeostore(
      { id: data.id, ...data.attributes },
      { type, adm0, adm1, adm2 }
    );
  });
};

export const saveGeostore = (geojson, onUploadProgress, onDownloadProgress) =>
  apiRequest({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data: {
      geojson,
    },
    url: '/geostore',
    onUploadProgress,
    onDownloadProgress,
  });
