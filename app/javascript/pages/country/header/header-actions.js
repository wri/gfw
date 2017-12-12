import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getExtent, getLoss } from 'services/forest-data';
import { getActiveAdmin } from 'pages/country/widget/widget-selectors';

export const setExtentLoading = createAction('setExtentLoading');
export const setPlantationsLossLoading = createAction('setPlantationsLossLoading');
export const setTotalLossLoading = createAction('setTotalLossLoading');

export const setTotalExtent = createAction('setTotalExtent');
export const setTotalLoss = createAction('setTotalLoss');
export const setPlantationsLoss = createAction('setPlantationsLoss');

export const getTotalExtent = createThunkAction(
  'getTotalExtent',
  params => (dispatch, state) => {
    if (!state().header.isExtentLoading) {
      dispatch(setExtentLoading(true));
      getExtent(params)
        .then(response => {
          const activeLocation = getActiveAdmin(state().location.payload);
          dispatch({
            [`${activeLocation}Area`]: response.data.rows[0].total_area,
            extent: response.data.rows[0].value
          });
        })
        .catch(error => {
          dispatch(setExtentLoading(false));
          console.info(error);
        });
    }
  }
);

export const getTotalLoss = createThunkAction(
  'getTotalLoss',
  params => (dispatch, state) => {
    if (!state().header.isTotalLossLoading) {
      dispatch(setTotalLoss(true));
      getLoss(params)
        .then(response => {
          console.log(response);
          // dispatch(setTotalLoss(response.data.data[0].value));
        })
        .catch(error => {
          dispatch(setTotalLoss(false));
          console.info(error);
        });
    }
  }
);

export const getPlantationsLoss = createThunkAction(
  'getPlantationsLoss',
  params => (dispatch, state) => {
    if (!state().header.isPlantationsLossLoading) {
      dispatch(setPlantationsLossLoading(true));
      getLoss(params)
        .then(response => {
          console.log(response);
          // dispatch(setTotalLoss(response.data.data[0].value));
        })
        .catch(error => {
          dispatch(setPlantationsLossLoading(false));
          console.info(error);
        });
    }
  }
);
