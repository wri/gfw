import { getExtent } from 'services/analysis-cached';
import axios from 'axios';

export default ({ params }) =>
  axios
    .all([
      getExtent({ ...params, forestType: '' }),
      getExtent({ ...params }),
      getExtent({ ...params, forestType: 'plantations' })
    ])
    .then(
      axios.spread((gadm28Response, iflResponse, plantationsResponse) => {
        const gadmExtent = gadm28Response.data && gadm28Response.data.data;
        const iflExtent = iflResponse.data && iflResponse.data.data;
        let totalArea = 0;
        let totalExtent = 0;
        let extent = 0;
        let plantations = 0;
        let data = {};
        const plantationsData =
          plantationsResponse.data && plantationsResponse.data.data;
        plantations = plantationsData.length ? plantationsData[0].extent : 0;
        if (iflExtent.length && gadmExtent.length) {
          totalArea = gadmExtent[0].total_area;
          totalExtent = gadmExtent[0].extent;
          extent = iflExtent[0].extent;
          data = {
            totalArea,
            totalExtent,
            extent,
            plantations
          };
        }
        return data;
      })
    );
