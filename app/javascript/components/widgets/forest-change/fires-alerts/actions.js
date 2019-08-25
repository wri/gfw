import { fetchFiresAlerts, fetchFiresLatest } from 'services/alerts';
import axios from 'axios';

export default ({ params }) =>
  axios.all([fetchFiresAlerts(params), fetchFiresLatest(params)]).then(
    axios.spread((alerts, latest) => {
      const { data } = alerts.data;
      return { alerts: data, latest } || {};
    })
  );
