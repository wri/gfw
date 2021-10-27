import { gfwApiRequest } from 'utils/request';

// gfwApiRequest === local/api/gfw-api
export const getGeodescriberByGeoJson = ({ geojson, token, template }) =>
  gfwApiRequest({
    method: 'post',
    url: `/geodescriber/geom?template=${template ? 'true' : 'false'}&app=gfw`,
    data: {
      geojson,
    },
    cancelToken: token,
  });

export const getGeodescriberByGeostore = async ({ geostore, token }) => {
  const geostoreResponse = await gfwApiRequest(`/v2/geostore/${geostore}`);
  const { geojson } = geostoreResponse?.data?.data?.attributes || {};

  return getGeodescriberByGeoJson({ geojson, token });
};
