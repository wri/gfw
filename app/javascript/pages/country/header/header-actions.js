import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getExtent, getLoss } from 'services/forest-data';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';

export const setExtentLoading = createAction('setExtentLoading');
export const setPlantationsLossLoading = createAction(
  'setPlantationsLossLoading'
);
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
          const { data } = response.data;
          if (data && data.length > 0) {
            dispatch(
              setTotalExtent({
                totalArea: (data[0] && data[0].total_area) || 0,
                extent: (data[0] && data[0].value) || 0
              })
            );
          }
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
          const { data } = response.data;
          const dataParsed =
            data && data.length
              ? reverse(sortBy(response.data.data, 'year'))[0]
              : {};
          dispatch(setTotalLoss(dataParsed));
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
          const { data } = response.data;
          const dataParsed =
            data && data.length ? reverse(sortBy(data, 'year'))[0] : {};
          dispatch(setPlantationsLoss(dataParsed));
        })
        .catch(error => {
          dispatch(setPlantationsLossLoading(false));
          console.info(error);
        });
    }
  }
);
