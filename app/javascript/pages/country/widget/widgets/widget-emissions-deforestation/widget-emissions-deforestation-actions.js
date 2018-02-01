import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getLoss } from 'services/forest-data';

const setEmissionsDeforestationData = createAction(
  'setEmissionsDeforestationData'
);
const setEmissionsDeforestationSettings = createAction(
  'setEmissionsDeforestationSettings'
);
const setEmissionsDeforestationLoading = createAction(
  'setEmissionsDeforestationLoading'
);

const getEmissionsDeforestationData = createThunkAction(
  'getEmissionsDeforestationData',
  params => (dispatch, state) => {
    if (!state().widgetEmissionsDeforestation.loading) {
      dispatch(
        setEmissionsDeforestationLoading({ loading: true, error: false })
      );
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
            dispatch(setEmissionsDeforestationData(data));
          })
        )
        .catch(error => {
          dispatch(
            setEmissionsDeforestationLoading({ loading: false, error: true })
          );
          console.info(error);
        });
    }
  }
);

export default {
  setEmissionsDeforestationData,
  setEmissionsDeforestationSettings,
  setEmissionsDeforestationLoading,
  getEmissionsDeforestationData
};
