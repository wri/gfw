import { createAction } from 'redux-actions';
import moment from 'moment';
import { createThunkAction } from 'utils/redux';

import { fetchViirsAlerts } from 'services/alerts';

const setFiresData = createAction('setFiresData');
const setFiresSettings = createAction('setFiresSettings');
const setFiresLoading = createAction('setFiresLoading');

const getFiresData = createThunkAction(
  'getFiresData',
  params => (dispatch, state) => {
    if (!state().widgetFires.loading) {
      dispatch(setFiresLoading({ loading: true, error: false }));

      const dates = [
        moment().format('YYYY-MM-DD'),
        moment()
          .subtract(params.periodValue, params.period)
          .format('YYYY-MM-DD')
      ];
      fetchViirsAlerts({ ...params, dates })
        .then(response => {
          dispatch(
            setFiresData({
              fires: response.data.data
            })
          );
        })
        .catch(error => {
          dispatch(setFiresLoading({ loading: false, error: true }));
          console.error(error);
        });
    }
  }
);

export default {
  setFiresData,
  setFiresSettings,
  setFiresLoading,
  getFiresData
};
