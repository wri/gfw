import { fetchFiresAlerts } from 'services/alerts';
import axios from 'axios';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  axios
    .all([fetchFiresAlerts(params)])
    .then(
      axios.spread(alerts => {
        let data = {};
        if (alerts && alerts.data) {
          const alertsData = alerts.data.data;
          data = {
            alerts: alertsData
          };
        }
        dispatch(setWidgetData({ data, widget }));
      })
    )
    .catch(error => {
      dispatch(setWidgetData({ widget, error: true }));
      console.info(error);
    });
};
