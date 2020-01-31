import {
  getExtentGrouped,
  getAreaIntersectionGrouped
} from 'services/forest-data-old';
import { all, spread } from 'axios';

export const getData = ({ params }) =>
  all([
    getExtentGrouped(params),
    getAreaIntersectionGrouped({ ...params, forestType: 'plantations' })
  ]).then(
    spread((extentGrouped, plantationsExtentResponse) => {
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
