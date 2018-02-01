import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getEmissions } from 'services/emissions';

const setEmissionsData = createAction('setEmissionsData');
const setEmissionsSettings = createAction('setEmissionsSettings');
const setEmissionsLoading = createAction('setEmissionsLoading');

const getEmissionsData = createThunkAction(
  'getEmissionsData',
  params => (dispatch, state) => {
    if (!state().widgetEmissions.loading) {
      dispatch(setEmissionsLoading({ loading: true, error: false }));
      getEmissions(params)
        .then(response => {
          dispatch(setEmissionsData(response.data));
        })
        .catch(error => {
          dispatch(setEmissionsLoading({ loading: false, error: true }));
          console.error(error);
        });
    }
  }
);

export default {
  setEmissionsData,
  setEmissionsSettings,
  setEmissionsLoading,
  getEmissionsData
};
