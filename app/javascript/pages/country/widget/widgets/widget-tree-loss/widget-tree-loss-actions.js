import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';

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
      axios
        .all([getLoss(params), getExtent(params)])
        .then(
          axios.spread((loss, extent) => {
            if (loss && extent) {
              dispatch(
                setTreeLossValues({
                  loss: loss.data.data,
                  startYear: minBy(loss.data.data, 'year').year,
                  endYear: maxBy(loss.data.data, 'year').year,
                  extent: extent.data.data[0].value
                })
              );
            } else {
              dispatch(setTreeLossIsLoading(false));
            }
          })
        )
        .catch(error => {
          dispatch(setTreeLossIsLoading(false));
          console.info(error);
        });
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
