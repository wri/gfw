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
        .all([
          getLoss(params),
          getLoss({ ...params, indicator: 'gadm28' }),
          getExtent(params)
        ])
        .then(
          axios.spread((plantationsloss, gadmLoss, plantationsExtent) => {
            let data = {};
            const loss = plantationsloss.data && plantationsloss.data.data;
            const totalLoss = gadmLoss.data && gadmLoss.data.data;
            const extent =
              plantationsExtent.data && plantationsExtent.data.data;
            if (loss.length && totalLoss.length && extent.length) {
              data = {
                loss,
                totalLoss,
                extent: extent[0].value || 0
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
