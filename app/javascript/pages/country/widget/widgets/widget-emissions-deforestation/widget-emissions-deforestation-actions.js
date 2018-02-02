import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

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
      getLoss(params)
        .then(response => {
          const loss = response.data && response.data.data;
          dispatch(setEmissionsDeforestationData(loss.length ? { loss } : {}));
        })
        .catch(error => {
          dispatch(
            setEmissionsDeforestationLoading({ loading: false, error: true })
          );
          console.error(error);
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
