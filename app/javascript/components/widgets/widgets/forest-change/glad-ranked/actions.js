import { fetchGladAlerts, fetchGLADLatest } from 'services/alerts';
import { getExtentGrouped } from 'services/forest-data-old';
import axios from 'axios';

export const getData = ({ params }) =>
  axios
    .all([
      fetchGladAlerts({ ...params, grouped: true }),
      fetchGLADLatest(params),
      getExtentGrouped(params)
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

export const getDataURL = params => [
  fetchGladAlerts({ ...params, download: true }),
  getExtentGrouped({ ...params, download: true })
];

export default getData;
