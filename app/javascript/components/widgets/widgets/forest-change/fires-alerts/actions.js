import { fetchFiresAlerts, fetchFiresLatest } from 'services/alerts';
import { all, spread } from 'axios';

export default ({ params }) =>
  all([fetchFiresAlerts(params), fetchFiresLatest(params)]).then(
    spread((alerts, latest) => {
      const { data } = alerts.data;
      return { alerts: data, latest } || {};
    })
  );
