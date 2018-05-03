import { getLocations, getLocationsLoss } from 'services/forest-data';
import groupBy from 'lodash/groupBy';
import axios from 'axios';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  axios
    .all([getLocations({ ...params }), getLocationsLoss({ ...params })])
    .then(
      axios.spread((getLocationsResponse, getLocationsLossResponse) => {
        const extentData = getLocationsResponse.data.data;
        let extentMappedData = {};
        if (extentData && extentData.length) {
          extentMappedData = extentData.map(d => ({
            id: d.region,
            extent: d.extent || 0,
            percentage: d.extent ? d.extent / d.total * 100 : 0
          }));
        }
        const lossData = getLocationsLossResponse.data.data;
        let lossMappedData = {};
        if (lossData && lossData.length) {
          const lossByRegion = groupBy(lossData, 'region');
          lossMappedData = Object.keys(lossByRegion).map(d => {
            const regionLoss = lossByRegion[d];
            return {
              id: parseInt(d, 10),
              loss: regionLoss
            };
          });
        }

        dispatch(
          setWidgetData({
            data: {
              lossByRegion: lossMappedData,
              extent: extentMappedData
            },
            widget
          })
        );
      })
    )
    .catch(error => {
      dispatch(setWidgetData({ widget, error: true }));
      console.info(error);
    });
};

export default {
  getData
};
