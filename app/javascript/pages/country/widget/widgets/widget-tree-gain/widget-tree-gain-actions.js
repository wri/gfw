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
        .all([getGain({ ...params }), getExtent({ ...params, threshold: 0 })])
        .then(
          axios.spread((getTreeGainResponse, getExtentResponse) => {
            const gain = getTreeGainResponse.data.data[0].value;
            const extent = getExtentResponse.data.data[0].value;
            dispatch(
              setTreeCoverGainData({
                gain,
                extent
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
