import { getExtent, getAreaIntersection } from 'services/forest-data';
import axios from 'axios';

export default ({ params }) =>
  axios
    .all([
      getExtent({ ...params, forestType: '' }),
      getAreaIntersection({ ...params, forestType: 'plantations' })
    ])
    .then(
      axios.spread((gadmResponse, plantationsResponse) => {
        const gadmExtent = gadmResponse.data && gadmResponse.data.data;
        const plantationsExtent =
          plantationsResponse.data && plantationsResponse.data.data;
        let data = {};
        if (gadmExtent.length && plantationsExtent.length) {
          const totalArea = gadmExtent[0].total_area;
          const totalExtent = gadmExtent[0].extent;
          data = {
            totalArea,
            totalExtent,
            plantations: plantationsExtent
          };
        }
        return data;
      })
    );
