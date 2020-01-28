import axios from 'axios';
import { fetchFiresAlertsGrouped, fetchFiresLatest } from 'services/alerts';

export const getDataURL = params => [
  fetchFiresAlertsGrouped({ ...params, download: true })
];

export default ({ params }) =>
  axios.all([fetchFiresAlertsGrouped(params), fetchFiresLatest(params)]).then(
    axios.spread((alerts, latest) => {
      const { data } = alerts.data;
      return { alerts: data, latest: latest.attributes.updatedAt } || {};
    })
  );
