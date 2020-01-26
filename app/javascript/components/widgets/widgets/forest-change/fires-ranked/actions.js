import { all, spread } from 'axios';
import { fetchFiresAlertsGrouped, fetchFiresLatest } from 'services/alerts';

export default ({ params }) =>
  all([fetchFiresAlertsGrouped(params), fetchFiresLatest(params)]).then(
    spread((alerts, latest) => {
      const { data } = alerts.data;
      return { alerts: data, latest: latest.attributes.updatedAt } || {};
    })
  );
