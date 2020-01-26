import { fetchGladIntersectionAlerts, fetchGLADLatest } from 'services/alerts';
import { getExtentGrouped } from 'services/forest-data';
import { all, spread } from 'axios';

export default ({ params }) =>
  all([
    fetchGladIntersectionAlerts(params),
    fetchGLADLatest(params),
    getExtentGrouped(params)
  ]).then(
    spread((alerts, latest, extent) => {
      const { data } = alerts.data;
      const areas = extent.data.data;
      const latestDate = latest.attributes && latest.attributes.updatedAt;

      return data && extent && latest
        ? {
          alerts: data,
          extent: areas,
          latest: latestDate,
          settings: { latestDate }
        }
        : {};
    })
  );
