import { fetchGladIntersectionAlerts, fetchGLADLatest } from 'services/alerts';
import { getMultiRegionExtent } from 'services/forest-data';
import axios from 'axios';

export default ({ params }) =>
  axios
    .all([
      fetchGladIntersectionAlerts({ ...params }),
      fetchGLADLatest(params),
      getMultiRegionExtent({ ...params })
    ])
    .then(
      axios.spread((alerts, latest, extent) => {
        const { data } = alerts.data;
        const latestData = latest.data.data;
        const areas = extent.data.data;
        return data && extent && latest
          ? {
            alerts: data,
            extent: areas,
            latest: latestData.attributes && latestData.attributes.updatedAt
          }
          : {};
      })
    );
