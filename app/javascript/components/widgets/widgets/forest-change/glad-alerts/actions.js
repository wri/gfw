import { fetchGladAlerts, fetchGLADLatest } from 'services/alerts';
import axios from 'axios';

export const getData = ({ params }) =>
  axios.all([fetchGladAlerts(params), fetchGLADLatest(params)]).then(
    axios.spread((alerts, latest) => {
      let data = {};
      if (alerts && alerts.data && latest) {
        const latestDate =
          latest && latest.attributes && latest.attributes.updatedAt;

        data = {
          alerts: alerts.data.data,
          latest: latestDate,
          settings: { latestDate }
        };
      }

      return data;
    })
  );

export const getDataURL = params => [
  fetchGladAlerts({ ...params, download: true })
];

export default getData;
