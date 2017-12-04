import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getTreeGain } from 'services/tree-gain';
import { getExtent } from 'services/tree-extent';

const setTreeCoverGainIsLoading = createAction('setTreeCoverGainIsLoading');
const setTreeCoverGainValues = createAction('setTreeCoverGainValues');
const setTreeCoverGainSettingsIndicator = createAction(
  'setTreeCoverGainSettingsIndicator'
);
const getTreeCoverGain = createThunkAction(
  'getTreeCoverGain',
  (country, region, subRegion, indicator) => dispatch => {
    axios
      .all([
        getTreeGain(country, region, subRegion, indicator),
        getExtent(country, region, subRegion, indicator, 0)
      ])
      .then(
        axios.spread((getTreeGainResponse, getExtentResponse) => {
          const gain = getTreeGainResponse.data.data[0].value;
          const treeExtent = getExtentResponse.data.data[0].value;

          dispatch(
            setTreeCoverGainValues({
              gain,
              treeExtent
            })
          );
        })
      )
      .catch(error => {
        console.info(error);
        dispatch(setTreeCoverGainIsLoading(false));
      });
  }
);

export default {
  setTreeCoverGainIsLoading,
  setTreeCoverGainValues,
  setTreeCoverGainSettingsIndicator,
  getTreeCoverGain
};
