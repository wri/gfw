import { fetchGladAlerts, fetchGLADLatest } from 'services/alerts';
import axios from 'axios';

export default ({ params }) =>
  axios.all([fetchGladAlerts(params), fetchGLADLatest(params)]).then(
    axios.spread((alerts, latest) => {
      let data = {};
      if (alerts && alerts.data && latest) {
        data = {
          alerts: alerts.data.data,
          latest: latest && latest.attributes && latest.attributes.updatedAt
        };
      }
      return data;
    })
  );
