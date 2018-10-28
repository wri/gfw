import { getLocations, getGainLocations } from 'services/forest-data';
import axios from 'axios';

export default ({ params }) =>
  axios
    .all([getLocations({ ...params }), getGainLocations({ ...params })])
    .then(
      axios.spread((getLocationsResponse, getGainLocationsResponse) => {
        const extentData = getLocationsResponse.data.data;
        let extentMappedData = {};
        if (extentData && extentData.length) {
          extentMappedData = extentData.map(d => ({
            id: d.region,
            extent: d.extent || 0,
            percentage: d.extent ? d.extent / d.total * 100 : 0
          }));
        }

        const gainData = getGainLocationsResponse.data.data;
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
