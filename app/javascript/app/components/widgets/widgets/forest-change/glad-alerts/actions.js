import { fetchGladAlerts, fetchGLADLatest } from 'services/alerts';
import axios from 'axios';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  axios
    .all([fetchGladAlerts(params), fetchGLADLatest()])
    .then(
      axios.spread((alerts, latest) => {
        let data = {};
        if (alerts && alerts.data && latest && latest.data) {
          const alertsData = alerts.data.data;
          const latestData = latest.data.data;
          data = {
            alerts: alertsData,
            latest: latestData.length && latestData[0].attributes.date
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
