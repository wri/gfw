import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getGain, getExtent } from 'services/forest-data';

const setTreeCoverGainIsLoading = createAction('setTreeCoverGainIsLoading');
const setTreeCoverGainData = createAction('setTreeCoverGainData');
const setTreeCoverGainSettingsIndicator = createAction(
  'setTreeCoverGainSettingsIndicator'
);

const getTreeCoverGain = createThunkAction(
  'getTreeCoverGain',
  params => (dispatch, state) => {
    if (!state().widgetTreeCoverGain.isLoading) {
      dispatch(setTreeCoverGainIsLoading(true));
      axios
        .all([getGain({ ...params }), getExtent({ ...params })])
        .then(
          axios.spread((gainResponse, extentResponse) => {
            const gain = gainResponse.data.data;
            const extent = extentResponse.data.data;
            dispatch(
              setTreeCoverGainData({
                gain: (gain.length && gain[0].value) || 0,
                extent: (extent.length && extent[0].value) || 0
              })
            );
          })
        )
        .catch(error => {
          console.info(error);
          dispatch(setTreeCoverGainIsLoading(false));
        });
    }
  }
);

export default {
  setTreeCoverGainIsLoading,
  setTreeCoverGainData,
  setTreeCoverGainSettingsIndicator,
  getTreeCoverGain
};
