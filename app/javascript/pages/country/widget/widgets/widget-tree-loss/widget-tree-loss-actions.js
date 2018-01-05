import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';

import { getExtent, getLoss } from 'services/forest-data';

const setTreeLossLoading = createAction('setTreeLossLoading');
const setTreeLossData = createAction('setTreeLossData');
const setTreeLossSettings = createAction('setTreeLossSettings');

const getTreeLoss = createThunkAction(
  'getTreeLoss',
  params => (dispatch, state) => {
    if (!state().widgetTreeLoss.isLoading) {
      dispatch(setTreeLossLoading(true));
      axios
        .all([getLoss(params), getExtent(params)])
        .then(
          axios.spread((loss, extent) => {
            if (loss && extent) {
              dispatch(
                setTreeLossData({
                  loss: loss.data.data,
                  startYear: minBy(loss.data.data, 'year').year,
                  endYear: maxBy(loss.data.data, 'year').year,
                  extent: extent.data.data[0].value
                })
              );
            } else {
              dispatch(setTreeLossLoading(false));
            }
          })
        )
        .catch(error => {
          dispatch(setTreeLossLoading(false));
          console.info(error);
        });
    }
  }
);

export default {
  setTreeLossData,
  setTreeLossSettings,
  setTreeLossLoading,
  getTreeLoss
};
