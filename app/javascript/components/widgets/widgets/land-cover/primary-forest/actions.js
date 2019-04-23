import { getExtent } from 'services/forest-data';
import axios from 'axios';

export default ({ params }) =>
  axios
    .all([
      getExtent({ ...params, forestType: '' }),
      getExtent({ ...params }),
      getExtent({
        ...params,
        forestType:
          params.forestType === 'primary_forest'
            ? 'plantations'
            : params.forestType
      })
    ])
    .then(
      axios.spread((gadm28Response, iflResponse, plantationsResponse) => {
        const gadmExtent = gadm28Response.data && gadm28Response.data.data;
        const primaryExtent = iflResponse.data && iflResponse.data.data;
        let totalArea = 0;
        let totalExtent = 0;
        let extent = 0;
        let plantations = 0;
        let data = {};
        const plantationsData =
          plantationsResponse.data && plantationsResponse.data.data;
        plantations = plantationsData.length ? plantationsData[0].value : 0;
        if (primaryExtent.length && gadmExtent.length) {
          totalArea = gadmExtent[0].total_area;
          totalExtent = gadmExtent[0].value;
          extent = primaryExtent[0].value;
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
