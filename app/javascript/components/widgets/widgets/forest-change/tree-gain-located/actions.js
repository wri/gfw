import { getExtentGrouped, getGainGrouped } from 'services/forest-data';
import axios from 'axios';

export default ({ params }) =>
  axios.all([getExtentGrouped(params), getGainGrouped(params)]).then(
    axios.spread((locations, gainGrouped) => {
      const extentData = locations.data.data;
      let extentMappedData = {};
      if (extentData && extentData.length) {
        extentMappedData = extentData.map(d => ({
          id: d.region,
          extent: d.extent || 0,
          percentage: d.extent ? d.extent / d.total * 100 : 0
        }));
      }

      const gainData = gainGrouped.data.data;
      let gainMappedData = {};
      if (gainData && gainData.length) {
        gainMappedData = gainData.map(d => ({
          id: d.region,
          gain: d.gain || 0
        }));
      }
      return {
        gain: gainMappedData,
        extent: extentMappedData
      };
    })
  );
