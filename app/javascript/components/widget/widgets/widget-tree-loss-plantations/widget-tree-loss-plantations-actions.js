import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getLoss } from 'services/forest-data';

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
        .all([getLoss(params), getLoss({ ...params, indicator: 'gadm28' })])
        .then(
          axios.spread((plantationsloss, gadmLoss) => {
            let data = {};
            const loss = plantationsloss.data && plantationsloss.data.data;
            const totalLoss = gadmLoss.data && gadmLoss.data.data;
            if (loss.length && totalLoss.length) {
              data = {
                loss,
                totalLoss
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
