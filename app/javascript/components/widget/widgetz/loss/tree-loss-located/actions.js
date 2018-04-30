import { getLocations, getLocationsLoss } from 'services/forest-data';
import groupBy from 'lodash/groupBy';
import axios from 'axios';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  axios
    .all([getLocations({ ...params }), getLocationsLoss({ ...params })])
    .then(
      axios.spread((getLocationsResponse, getLocationsLossResponse) => {
        const extentData = getLocationsResponse.data.data;
        const extentMappedData = {};
        if (extentData && extentData.length) {
          extentMappedData.regions = extentData.map(d => ({
            id: d.region,
            extent: d.extent || 0,
            percentage: d.extent ? d.extent / d.total * 100 : 0
          }));
        }
        const lossData = getLocationsLossResponse.data.data;
        const lossMappedData = {};
        if (lossData && lossData.length) {
          const lossByRegion = groupBy(lossData, 'region');
          lossMappedData.regions = Object.keys(lossByRegion).map(d => {
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
              loss: lossMappedData.regions,
              extent: extentMappedData.regions
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
