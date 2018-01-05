import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getGain, getExtent } from 'services/forest-data';

const setTreeGainLoading = createAction('setTreeGainLoading');
const setTreeGainData = createAction('setTreeGainData');
const setTreeGainSettings = createAction('setTreeGainSettings');

const getTreeGain = createThunkAction(
  'getTreeGain',
  params => (dispatch, state) => {
    if (!state().widgetTreeGain.loading) {
      dispatch(setTreeGainLoading(true));
      axios
        .all([getGain({ ...params }), getExtent({ ...params })])
        .then(
          axios.spread((gainResponse, extentResponse) => {
            const gain = gainResponse.data.data;
            const extent = extentResponse.data.data;
            dispatch(
              setTreeGainData({
                gain: (gain.length && gain[0].value) || 0,
                extent: (extent.length && extent[0].value) || 0
              })
            );
          })
        )
        .catch(error => {
          console.info(error);
          dispatch(setTreeGainLoading(false));
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
