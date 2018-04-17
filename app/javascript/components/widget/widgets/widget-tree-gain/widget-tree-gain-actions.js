import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getGainRanked, getExtent } from 'services/forest-data';

const setTreeGainLoading = createAction('setTreeGainLoading');
const setTreeGainData = createAction('setTreeGainData');
const setTreeGainSettings = createAction('setTreeGainSettings');

const getTreeGain = createThunkAction(
  'getTreeGain',
  params => (dispatch, state) => {
    if (!state().widgetTreeGain.loading) {
      dispatch(setTreeGainLoading({ loading: true, error: false }));
      axios
        .all([getGainRanked(params), getExtent(params)])
        .then(
          axios.spread((gainResponse, extentResponse) => {
            const gainData = gainResponse.data.data;
            const extentData = extentResponse.data.data;
            let mappedData = [];
            if (
              gainData &&
              gainData.length &&
              extentData &&
              extentData.length
            ) {
              mappedData = gainData.map(item => {
                const gain = item.gain ? item.gain : 0;
                return {
                  id: item.region,
                  gain,
                  percentage: 100 * gain / extentData[0].value
                };
              });
            }
            dispatch(setTreeGainData({ gain: mappedData }));
          })
        )
        .catch(error => {
          console.info(error);
          dispatch(setTreeGainLoading({ loading: false, error: true }));
        });
    }
  }
);

export default {
  setTreeGainLoading,
  setTreeGainData,
  setTreeGainSettings,
  getTreeGain
};
