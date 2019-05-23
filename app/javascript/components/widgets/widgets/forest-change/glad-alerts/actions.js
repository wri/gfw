import { fetchGladAlerts, fetchGLADLatest } from 'services/alerts';
import axios from 'axios';

export default ({ params }) =>
  axios.all([fetchGladAlerts(params), fetchGLADLatest(params)]).then(
    axios.spread((alerts, latest) => {
      let data = {};
      if (alerts && alerts.data && latest && latest.data) {
        const alertsData = alerts.data.data;
        const latestData = latest.data.data;
        const latestDate =
          latestData &&
          latestData.attributes &&
          latestData.attributes.updatedAt;

        data = {
          alerts: alertsData,
          latest: latestDate,
          settings: { latestDate }
        };
      }

      return data;
    })
  );
