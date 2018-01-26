import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { fetchGladAlerts } from 'services/alerts';

const setGladAlertsLoading = createAction('setGladAlertsLoading');
const setGladAlertsData = createAction('setGladAlertsData');
const setGladAlertsSettings = createAction('setGladAlertsSettings');
const setActiveAlert = createAction('setActiveAlert');

const getGladAlerts = createThunkAction(
  'getGladAlerts',
  params => (dispatch, state) => {
    if (!state().widgetGladAlerts.loading) {
      dispatch(setGladAlertsLoading({ loading: true, error: false }));
      fetchGladAlerts(params)
        .then(alerts => {
          let data = {};
          if (alerts && alerts.data) {
            const response = alerts.data.data;
            data = {
              alerts: response.attributes.value,
              period: response.period.split(',')
            };
          }
          dispatch(setGladAlertsData(data));
        })
        .catch(error => {
          dispatch(setGladAlertsLoading({ loading: false, error: true }));
          console.info(error);
        });
    }
  }
);

export default {
  setGladAlertsData,
  setGladAlertsSettings,
  setGladAlertsLoading,
  getGladAlerts,
  setActiveAlert
};
