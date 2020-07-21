import { getGoogleLangCode } from 'utils/lang';
import { apiRequest } from 'utils/request';

const buildGeostoreUrl = ({ type, adm0, adm1, adm2, thresh }) => {
  let slug = type !== 'geostore' ? type : '';
  if (type === 'country') slug = 'admin';

  return `/v2/geostore${slug ? `/${slug}` : ''}/${adm0}${
    adm1 ? `/${adm1}` : ''
  }${adm2 ? `/${adm2}` : ''}${`?simplify=${!adm1 ? thresh : thresh / 10}`}`;
};

export const getGeostoreProvider = ({ type, adm0, adm1, adm2, token }) => {
  let thresh = 0.005;
  if (type === 'country') {
    const bigCountries = ['USA', 'RUS', 'CAN', 'CHN', 'BRA', 'IDN', 'AUS'];
    thresh = bigCountries.includes(adm0) ? 0.05 : 0.005;
  }
  const url = buildGeostoreUrl({ type, adm0, adm1, adm2, thresh });

  return apiRequest.get(url, { cancelToken: token });
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
