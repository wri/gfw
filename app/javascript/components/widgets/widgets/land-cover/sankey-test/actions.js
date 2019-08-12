import { getUSLandCover } from 'services/forest-data';
// import axios from 'axios';

export default ({ params }) =>
  /* axios
    .get(getUSLandCover(params))
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
  */
  getUSLandCover(params);
