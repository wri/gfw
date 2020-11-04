import { getGoogleLangCode } from 'utils/lang';
import { apiRequest } from 'utils/request';

export const getGeodescriberByGeoJson = ({ geojson, lang, token }) =>
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

export const getGeodescriberByGeostore = ({ geostore, lang, token }) =>
  // for now we are forcing english until API works
  apiRequest({
    method: 'get',
    url: `/geodescriber/?geostore=${geostore}&lang=${getGoogleLangCode(
      lang
    )}&app=gfw`,
    cancelToken: token,
  });
