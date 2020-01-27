import { getExtentGrouped, getLossGrouped } from 'services/forest-data-old';
import groupBy from 'lodash/groupBy';
import axios from 'axios';

export const getData = ({ params }) =>
  axios.all([getExtentGrouped(params), getLossGrouped(params)]).then(
    axios.spread((extentGrouped, lossGrouped) => {
      let groupKey = 'iso';
      if (params.adm0) groupKey = 'adm1';
      if (params.adm1) groupKey = 'adm2';

      const extentData = extentGrouped.data.data;
      let extentMappedData = {};
      if (extentData && extentData.length) {
        extentMappedData = extentData.map(d => ({
          id: groupKey === 'iso' ? d[groupKey] : parseInt(d[groupKey], 10),
          extent: d.extent || 0,
          percentage: d.extent ? d.extent / d.total * 100 : 0
        }));
      }
      const lossData = lossGrouped.data.data;
      let lossMappedData = {};
      if (lossData && lossData.length) {
        const lossByRegion = groupBy(lossData, groupKey);
        lossMappedData = Object.keys(lossByRegion).map(d => {
          const regionLoss = lossByRegion[d];
          return {
            id: groupKey === 'iso' ? d : parseInt(d, 10),
            loss: regionLoss
          };
        });
      }
      return {
        lossByRegion: lossMappedData,
        extent: extentMappedData
      };
    })
  );

export const getDataURL = params => [
  getExtentGrouped({ ...params, download: true }),
  getLossGrouped({ ...params, download: true })
];

export default getData;
