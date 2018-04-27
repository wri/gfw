import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { fetchGladAlerts, fetchGLADLatest } from 'services/alerts';

const setGladAlertsLoading = createAction('setGladAlertsLoading');
const setGladAlertsData = createAction('setGladAlertsData');
const setGladAlertsSettings = createAction('setGladAlertsSettings');

const getGladAlerts = createThunkAction(
  'getGladAlerts',
  params => (dispatch, state) => {
    if (!state().widgetGladAlerts.loading) {
      dispatch(setGladAlertsLoading({ loading: true, error: false }));
      axios
        .all([fetchGladAlerts({ ...params }), fetchGLADLatest()])
        .then(
          axios.spread((alerts, latest) => {
            let data = {};
            if (alerts && alerts.data && latest && latest.data) {
              const alertsData = alerts.data;
              const latestData = latest.data.data;
              data = {
                alerts: alertsData.data,
                latest: latestData[0].attributes.date
              };
            }
            dispatch(setGladAlertsData(data));
          })
        )
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
  getGladAlerts
};
