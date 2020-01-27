import { getExtent, getAreaIntersection } from 'services/analysis-cached';
import axios from 'axios';

export const getData = ({ params }) =>
  axios
    .all([
      getExtent(params),
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

export const getDataURL = params => [
  getExtent({ ...params, download: true }),
  getAreaIntersection({ ...params, forestType: 'plantations', download: true })
];

export default getData;
