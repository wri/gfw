import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getExtent, getLoss } from 'services/forest-data';

const setTreeLossPlantationsLoading = createAction(
  'setTreeLossPlantationsLoading'
);
const setTreeLossPlantationsData = createAction('setTreeLossPlantationsData');
const setTreeLossPlantationsSettings = createAction(
  'setTreeLossPlantationsSettings'
);

const getTreeLossPlantations = createThunkAction(
  'getTreeLossPlantations',
  params => (dispatch, state) => {
    if (!state().widgetTreeLossPlantations.loading) {
      dispatch(setTreeLossPlantationsLoading({ loading: true, error: false }));
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
            dispatch(setTreeLossPlantationsData(data));
          })
        )
        .catch(error => {
          dispatch(
            setTreeLossPlantationsLoading({ loading: false, error: true })
          );
          console.info(error);
        });
    }
  }
);

export default {
  setTreeLossPlantationsData,
  setTreeLossPlantationsSettings,
  setTreeLossPlantationsLoading,
  getTreeLossPlantations
};
