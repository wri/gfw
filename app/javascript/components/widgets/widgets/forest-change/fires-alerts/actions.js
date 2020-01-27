import { fetchFiresAlerts, fetchFiresLatest } from 'services/alerts';
import axios from 'axios';

export const getData = ({ params }) =>
  axios.all([fetchFiresAlerts(params), fetchFiresLatest(params)]).then(
    axios.spread((alerts, latest) => {
      const { data } = alerts.data;
      return { alerts: data, latest } || {};
    })
  );

export const getDataURL = params => [
  fetchFiresAlerts({ ...params, download: true })
];

export default getData;
