import { apiRequest } from 'utils/request';

const ENVIRONMENT = process.env.NEXT_PUBLIC_FEATURE_ENV;

export const getGeodescriberByGeoJson = ({ geojson, token, template }) =>
  apiRequest({
    method: 'post',
    url: `${
      ENVIRONMENT === 'staging' ? '/v1' : ''
    }/geodescriber/geom?template=${template ? 'true' : 'false'}&app=gfw`,
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
