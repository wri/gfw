import { apiRequest } from 'utils/request';

export const getGeodescriberByGeoJson = ({ geojson, token, template }) => {
  return apiRequest({
    method: 'post',
    url: `/geodescriber/geom/?template=${template ? 'true' : 'false'}&app=gfw`,
    data: {
      geojson,
    },
    cancelToken: token,
  }).catch(() => {});
};

export const getGeodescriberByGeostore = async ({ geostore, token }) => {
  const geostoreResponse = await apiRequest(`/v2/geostore/${geostore}`);
  const { geojson } = geostoreResponse?.data?.data?.attributes || {};

  return getGeodescriberByGeoJson({ geojson, token });
};
