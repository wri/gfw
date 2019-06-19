import axios from 'axios';
import { getExtent } from 'services/forest-data';

export const getData = ({ params }) =>
  axios
    .all([
      getExtent(params),
      getExtent({ ...params, forestType: null, landCategory: null }),
      getExtent({ ...params, forestType: 'plantations' })
    ])
    .then(
      axios.spread((response, adminResponse, plantationsResponse) => {
        const extent = response.data && response.data.data;
        const adminExtent = adminResponse.data && adminResponse.data.data;
        let totalArea = 0;
        let totalCover = 0;
        let cover = 0;
        let plantations = 0;
        let data = {};
        if (extent && extent.length) {
          totalArea = adminExtent[0].total_area;
          cover = extent[0].value;
          totalCover = adminExtent[0].value;
          data = {
            totalArea,
            totalCover,
            cover,
            plantations
          };
        }
        if (params.forestType || params.landCategory) {
          return data;
        }
        // if plantations get more data
        const plantationsData =
          plantationsResponse.data && plantationsResponse.data.data;
        plantations =
          plantationsData && plantationsData.length
            ? plantationsData[0].value
            : 0;
        if (extent && extent.length) {
          data = {
            ...data,
            plantations
          };
        }
        return data;
      })
    );

export const getDataURL = ({ params }) => [
  getExtent({ ...params, download: true }),
  getExtent({
    ...params,
    forestType: null,
    landCategory: null,
    download: true
  }),
  getExtent({ ...params, forestType: 'plantations', download: true })
];

export default getData;
