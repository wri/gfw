import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';
import groupBy from 'lodash/groupBy';

import { getLocations, getLocationsLoss } from 'services/forest-data';

const setLossLocatedData = createAction('setLossLocatedData');
const setLossLocatedPage = createAction('setLossLocatedPage');
const setLossLocatedSettings = createAction('setLossLocatedSettings');
const setLossLocatedLoading = createAction('setLossLocatedLoading');

const getLossLocated = createThunkAction(
  'getLossLocated',
  params => (dispatch, state) => {
    if (!state().widgetLossLocated.loading) {
      dispatch(setLossLocatedLoading({ loading: true, error: false }));

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
              setLossLocatedData({
                loss: lossMappedData,
                extent: extentMappedData
              })
            );
          })
        )
        .catch(error => {
          console.info(error);
          dispatch(setLossLocatedLoading({ loading: false, error: true }));
        });
    }
  }
);

export default {
  setLossLocatedData,
  setLossLocatedPage,
  setLossLocatedSettings,
  setLossLocatedLoading,
  getLossLocated
};
