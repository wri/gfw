import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getExtent, getLoss } from 'services/forest-data';

const setTreeLossLoading = createAction('setTreeLossLoading');
const setTreeLossData = createAction('setTreeLossData');
const setTreeLossSettings = createAction('setTreeLossSettings');

const getTreeLoss = createThunkAction(
  'getTreeLoss',
  params => (dispatch, state) => {
    if (!state().widgetTreeLoss.loading) {
      dispatch(setTreeLossLoading({ loading: true, error: false }));
      axios
        .all([getLoss(params), getExtent(params)])
        .then(
          axios.spread((loss, extent) => {
            let data = {};
            if (loss && loss.data && extent && extent.data) {
              data = {
                loss: loss.data.data,
                extent: (loss.data.data && extent.data.data[0].value) || 0
              };
            }
            dispatch(setTreeLossData(data));
          })
        )
        .catch(error => {
          dispatch(setTreeLossLoading({ loading: false, error: true }));
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
