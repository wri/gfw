import { fetchGladIntersectionAlerts, fetchGLADLatest } from 'services/alerts';
import { getMultiRegionExtent } from 'services/forest-data';
import axios from 'axios';

export const getData = ({ params }) =>
  axios
    .all([
      fetchGladIntersectionAlerts({ ...params }),
      fetchGLADLatest(params),
      getMultiRegionExtent({ ...params })
    ])
    .then(
      axios.spread((alerts, latest, extent) => {
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

export const getDataURL = ({ params }) => [
  fetchGladIntersectionAlerts({ ...params, download: true }),
  getMultiRegionExtent({ ...params, download: true })
];

export default getData;
