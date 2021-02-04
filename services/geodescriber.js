import { apiRequest } from 'utils/request';
import { CancelToken } from 'axios';
import { getGeostore } from 'services/geostore';

export const getGeodescriberByGeoJson = ({ geojson, token, template }) =>
  apiRequest({
    method: 'post',
    url: `/geodescriber/geom?template=${template ? 'true' : 'false'}&app=gfw`,
    data: {
      geojson,
    },
    cancelToken: token,
  });

export const getGeodescriberByGeostore = async ({ geostore, token }) => {
  const geostoreResponse = await apiRequest(`/v2/geostore/${geostore}`);
  const { geojson } = geostoreResponse?.data?.data?.attributes || {};

  return getGeodescriberByGeoJson({ geojson, token });
};

export const getSSRSentence = ({ location }) => {
  let params = {};
  let geojson;
  const { type, adm0, adm1, adm2 } = params;
  let { token } = params;
  if (type && adm0) {
    getGeostore({ type, adm0, adm1, adm2, token })
      .then((geostore) => {
        if (geostore) {
          geojson = geostore.geojson;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  token = CancelToken.source();

  let geodescriber;

  if (geojson) {
    params = {
      geojson,
      token,
      lang: 'en',
    };
  }

  getGeodescriberByGeoJson({ ...params, template: true })
    .then((response) => {
      geodescriber = response.data.data;
    })
    .catch((err) => {
      console.error(err);
    });

  // if not an admin we can use geodescriber
  if (!['global', 'country'].includes(location.type)) {
    return {
      sentence: geodescriber.description,
      params: geodescriber.description_params,
    };
  }

  // if an admin we needs to calculate the params
  return '';
};
