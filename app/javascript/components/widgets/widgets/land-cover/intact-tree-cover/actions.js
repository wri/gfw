import { getExtent } from 'services/forest-data';
import axios from 'axios';

export const getData = ({ params }) => {
  let polyname = 'plantations';
  switch (params.indicator) {
    case 'ifl__wdpa':
      polyname = 'plantations__wdpa';
      break;
    case 'ifl__mining':
      polyname = 'plantations__mining';
      break;
    default:
      break;
  }
  return axios
    .all([
      getExtent({ ...params, forestType: '' }),
      getExtent({ ...params }),
      getExtent({ ...params, indicator: polyname })
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
        plantations = plantationsData.length ? plantationsData[0].value : 0;
        if (iflExtent.length && gadmExtent.length) {
          totalArea = gadmExtent[0].total_area;
          totalExtent = gadmExtent[0].value;
          extent = iflExtent[0].value;
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
};

export const getDataURL = ({ params }) => {
  if (!params) return null;
  let polyname = 'plantations';
  switch (params.indicator) {
    case 'ifl__wdpa':
      polyname = 'plantations__wdpa';
      break;
    case 'ifl__mining':
      polyname = 'plantations__mining';
      break;
    default:
      break;
  }
  return [
    getExtent({ ...params, forestType: '', download: true }),
    getExtent({ ...params, download: true }),
    getExtent({ ...params, indicator: polyname, download: true })
  ];
};

export default getData;
