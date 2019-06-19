import {
  getMultiRegionExtent,
  getPlantationsExtent
} from 'services/forest-data';
import axios from 'axios';

export const getData = ({ params }) =>
  axios
    .all([
      getMultiRegionExtent(params),
      getPlantationsExtent({ ...params, groupByRegion: true })
    ])
    .then(
      axios.spread((multiRegionExtentResponse, plantationsExtentResponse) => {
        let data = {};
        const extent =
          multiRegionExtentResponse.data && multiRegionExtentResponse.data.data;
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

export const getDataURL = ({ params }) => [
  getMultiRegionExtent({ ...params, download: true }),
  getPlantationsExtent({ ...params, groupByRegion: true, download: true })
];

export default getData;
