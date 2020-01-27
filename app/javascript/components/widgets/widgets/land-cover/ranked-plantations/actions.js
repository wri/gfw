import {
  getExtentGrouped,
  getAreaIntersectionGrouped
} from 'services/forest-data-old';
import axios from 'axios';

export const getData = ({ params }) =>
  axios
    .all([
      getExtentGrouped(params),
      getAreaIntersectionGrouped({ ...params, forestType: 'plantations' })
    ])
    .then(
      axios.spread((extentGrouped, plantationsExtentResponse) => {
        let data = {};
        const extent = extentGrouped.data && extentGrouped.data.data;
        const plantationsExtent =
          plantationsExtentResponse.data && plantationsExtentResponse.data.data;
        if (extent.length && plantationsExtent.length) {
          data = {
            extent,
            plantations: plantationsExtent
          };
        }

        return data;
      })
    );

export const getDataURL = params => [
  getExtentGrouped({ ...params, download: true }),
  getAreaIntersectionGrouped({
    ...params,
    forestType: 'plantations',
    download: true
  })
];

export default getData;
