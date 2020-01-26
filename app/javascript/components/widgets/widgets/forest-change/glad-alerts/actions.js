import { fetchGladAlerts, fetchGLADLatest } from 'services/alerts';
import { all, spread } from 'axios';

export default ({ params }) =>
  all([fetchGladAlerts(params), fetchGLADLatest(params)]).then(
    spread((alerts, latest) => {
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
