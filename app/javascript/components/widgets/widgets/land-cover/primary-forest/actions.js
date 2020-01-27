import { getExtent } from 'services/forest-data-old';
import { all, spread } from 'axios';

export const getData = ({ params }) =>
  all([
    getExtent({ ...params, forestType: '' }),
    getExtent({ ...params }),
    getExtent({
      ...params,
      forestType:
        params.forestType === 'primary_forest'
          ? 'plantations'
          : params.forestType
    })
  ]).then(
    spread((gadm28Response, iflResponse, plantationsResponse) => {
      const gadmExtent = gadm28Response.data && gadm28Response.data.data;
      const primaryExtent = iflResponse.data && iflResponse.data.data;
      let totalArea = 0;
      let totalExtent = 0;
      let extent = 0;
      let plantations = 0;
      let data = {};
      const plantationsData =
        plantationsResponse.data && plantationsResponse.data.data;
      plantations = plantationsData.length ? plantationsData[0].extent : 0;
      if (primaryExtent.length && gadmExtent.length) {
        totalArea = gadmExtent[0].total_area;
        totalExtent = gadmExtent[0].extent;
        extent = primaryExtent[0].extent;
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

export const getDataURL = params => [
  getExtent({ ...params, forestType: '', download: true }),
  getExtent({ ...params, download: true }),
  getExtent({
    ...params,
    forestType:
      params.forestType === 'primary_forest'
        ? 'plantations'
        : params.forestType,
    download: true
  })
];

export default getData;
