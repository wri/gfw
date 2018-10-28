import { fetchFiresAlerts } from 'services/alerts';

export default ({ params }) =>
  fetchFiresAlerts(params).then(alerts => {
    const { data } = alerts.data;
    return data || {};
  });
