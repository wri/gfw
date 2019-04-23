import { getExtentGrouped, getLossGrouped } from 'services/forest-data';
import groupBy from 'lodash/groupBy';
import axios from 'axios';

export default ({ params }) =>
  axios.all([getExtentGrouped(params), getLossGrouped(params)]).then(
    axios.spread((extentGrouped, lossGrouped) => {
      let groupKey = 'adm0';
      if (params.adm0) groupKey = 'adm1';
      if (params.adm1) groupKey = 'adm2';

      const extentData = extentGrouped.data.data;
      let extentMappedData = {};
      if (extentData && extentData.length) {
        extentMappedData = extentData.map(d => ({
          id: d[groupKey],
          extent: d.value || 0,
          percentage: d.value ? d.value / d.total * 100 : 0
        }));
      }
      const lossData = lossGrouped.data.data;
      let lossMappedData = {};
      if (lossData && lossData.length) {
        const lossByRegion = groupBy(lossData, groupKey);
        lossMappedData = Object.keys(lossByRegion).map(d => {
          const regionLoss = lossByRegion[d];
          return {
            id: parseInt(d, 10),
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
