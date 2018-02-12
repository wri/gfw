import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getLocations, getGainLocations } from 'services/forest-data';

const setGainLocatedData = createAction('setGainLocatedData');
const setGainLocatedPage = createAction('setGainLocatedPage');
const setGainLocatedSettings = createAction('setGainLocatedSettings');
const setGainLocatedLoading = createAction('setGainLocatedLoading');

const getGainLocated = createThunkAction(
  'getGainLocated',
  params => (dispatch, state) => {
    if (!state().widgetGainLocated.loading) {
      dispatch(setGainLocatedLoading({ loading: true, error: false }));
      axios
        .all([getLocations({ ...params }), getGainLocations({ ...params })])
        .then(
          axios.spread((getLocationsResponse, getGainLocationsResponse) => {
            const extentData = getLocationsResponse.data.data;
            const extentMappedData = {};
            if (extentData && extentData.length) {
              extentMappedData.regions = extentData.map(d => ({
                id: d.region,
                extent: d.extent || 0,
                percentage: d.extent ? d.extent / d.total * 100 : 0
              }));
            }

            const gainData = getGainLocationsResponse.data.data;
            const gainMappedData = {};
            if (gainData && gainData.length) {
              gainMappedData.regions = gainData.map(d => ({
                id: d.region,
                gain: d.gain || 0
              }));
            }
            dispatch(
              setGainLocatedData({
                gain: gainMappedData,
                extent: extentMappedData
              })
            );
          })
        )
        .catch(error => {
          console.info(error);
          dispatch(setGainLocatedLoading({ loading: false, error: true }));
        });
    }
  }
);

export default {
  setGainLocatedData,
  setGainLocatedPage,
  setGainLocatedSettings,
  setGainLocatedLoading,
  getGainLocated
};
