import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getExtent, getLoss } from 'services/forest-data';

const setTreeLossIsLoading = createAction('setTreeLossIsLoading');

const setTreeLossValues = createAction('setTreeLossValues');
const setTreeLossSettingsIndicator = createAction(
  'setTreeLossSettingsIndicator'
);
const setTreeLossSettingsThreshold = createAction(
  'setTreeLossSettingsThreshold'
);
const setTreeLossSettingsStartYear = createAction(
  'setTreeLossSettingsStartYear'
);
const setTreeLossSettingsEndYear = createAction('setTreeLossSettingsEndYear');
const setLayers = createAction('setLayers');

const getTreeLoss = createThunkAction(
  'getTreeLoss',
  params => (dispatch, state) => {
    if (!state().widgetTreeLoss.isLoading) {
      dispatch(setTreeLossIsLoading(true));
      axios.all([getExtent(params), getLoss(params)]).then(
        axios.spread((loss, extent) => {
          setTreeLossValues({
            loss: loss.data.data,
            extent: extent.data.data[0].value
          });
        })
      );
    }
  }
);

export default {
  setTreeLossValues,
  setTreeLossSettingsIndicator,
  setTreeLossSettingsThreshold,
  setTreeLossIsLoading,
  setTreeLossSettingsStartYear,
  setTreeLossSettingsEndYear,
  setLayers,
  getTreeLoss
};
