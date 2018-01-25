import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getExtent, getLoss } from 'services/forest-data';
import { fetchGladAlerts } from 'services/alerts';

const setGladAlertsLoading = createAction('setGladAlertsLoading');
const setGladAlertsData = createAction('setGladAlertsData');
const setGladAlertsSettings = createAction('setGladAlertsSettings');

const getGladAlerts = createThunkAction(
  'getGladAlerts',
  params => (dispatch, state) => {
    if (!state().widgetGladAlerts.loading) {
      dispatch(setGladAlertsLoading({ loading: true, error: false }));
      axios
        .all([fetchGladAlerts(params), getExtent(params)])
        .then(
          axios.spread((loss, extent) => {
            let data = {};
            if (loss && loss.data) {
              data = {
                loss: loss.data.data.attributes.value
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
