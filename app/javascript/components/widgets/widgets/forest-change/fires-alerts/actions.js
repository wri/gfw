import { fetchFiresAlerts, fetchFiresLatest } from 'services/alerts';
import { all, spread } from 'axios';

export const getData = ({ params }) =>
  all([fetchFiresAlerts(params), fetchFiresLatest(params)]).then(
    spread((alerts, latest) => {
      const { data } = alerts.data;
      return { alerts: data, latest } || {};
    })
  );

export const getDataURL = params => [
  fetchFiresAlerts({ ...params, download: true })
];

export default getData;
