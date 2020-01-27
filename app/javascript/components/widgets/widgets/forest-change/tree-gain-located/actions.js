import { getExtentGrouped, getGainGrouped } from 'services/forest-data-old';
import { all, spread } from 'axios';

export const getData = ({ params }) =>
  all([getExtentGrouped(params), getGainGrouped(params)]).then(
    spread((extentGrouped, gainGrouped) => {
      let groupKey = 'iso';
      if (params.adm0) groupKey = 'adm1';
      if (params.adm1) groupKey = 'adm2';

      const extentData = extentGrouped.data.data;
      let extentMappedData = {};
      if (extentData && extentData.length) {
        extentMappedData = extentData.map(d => ({
          id: d[groupKey],
          extent: d.extent || 0,
          percentage: d.extent ? d.extent / d.total_area * 100 : 0
        }));
      }

      const gainData = gainGrouped.data.data;
      let gainMappedData = {};
      if (gainData && gainData.length) {
        gainMappedData = gainData.map(d => ({
          id: d[groupKey],
          gain: d.gain || 0
        }));
      }

      return {
        gain: gainMappedData,
        extent: extentMappedData
      };
    })
  );

export const getDataURL = params => [
  getExtentGrouped({ ...params, download: true }),
  getGainGrouped({ ...params, download: true })
];

export default getData;
