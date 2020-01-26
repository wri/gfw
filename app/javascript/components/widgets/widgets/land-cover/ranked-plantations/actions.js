import {
  getExtentGrouped,
  getAreaIntersectionGrouped
} from 'services/forest-data';
import { all, spread } from 'axios';

export default ({ params }) =>
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
