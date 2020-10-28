import { getGoogleLangCode } from 'utils/lang';
import {
  apiRequest,
  makeCancelRequestCreator,
  dataRequest,
} from 'utils/request';

const buildGeostoreUrl = ({ type, adm0, adm1, adm2, thresh }) => {
  let slug = type !== 'geostore' ? type : '';
  if (type === 'country') slug = 'admin';

  return `/v2/geostore${slug ? `/${slug}` : ''}/${adm0}${
    adm1 ? `/${adm1}` : ''
  }${adm2 ? `/${adm2}` : ''}${`?simplify=${!adm1 ? thresh : thresh / 10}`}`;
};

export const getGeostoreProvider = ({
  type,
  adm0,
  adm1,
  adm2,
  token,
  cancel = false,
}) => {
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
              data: {
                data: {
                  id: gfw_geostore_id,
                  attributes: {
                    geojson: gfw_geojson,
                    areaHa: gfw_area__ha,
                    bbox: gfw_bbox,
                  },
                },
              },
            };
          });
      });
  }

  const url = buildGeostoreUrl({ type, adm0, adm1, adm2, thresh });

  if (cancel) {
    const request = makeCancelRequestCreator(apiRequest);

    return request({
      method: 'get',
      url,
    });
  }

  return apiRequest.get(url);
};

export const getGeostoreKey = (geojson, onUploadProgress, onDownloadProgress) =>
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

export const getGeodescriberService = ({ geojson, lang, token }) =>
  // for now we are forcing english until API works
  apiRequest({
    method: 'post',
    url: `/geodescriber/geom?lang=${getGoogleLangCode(
      lang
    )}&template=true&app=gfw`,
    data: {
      geojson,
    },
    cancelToken: token,
  });

export const getGeodescriber = ({ geostore, lang, token }) =>
  // for now we are forcing english until API works
  apiRequest({
    method: 'get',
    url: `/geodescriber/?geostore=${geostore}&lang=${getGoogleLangCode(
      lang
    )}&app=gfw`,
    cancelToken: token,
  });
