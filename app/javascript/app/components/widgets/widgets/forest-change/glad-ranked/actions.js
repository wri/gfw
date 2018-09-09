import { fetchGladIntersectionAlerts, fetchGLADLatest } from 'services/alerts';
import { getMultiRegionExtent } from 'services/forest-data';
import axios from 'axios';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  axios
    .all([
      fetchGladIntersectionAlerts({ ...params }),
      fetchGLADLatest(),
      getMultiRegionExtent({ ...params })
    ])
    .then(
      axios.spread((alerts, latest, extent) => {
        const { data } = alerts.data;
        const latestData = latest.data.data;
        const areas = extent.data.data;
        dispatch(
          setWidgetData({
            data:
              data && extent && latest
                ? {
                  alerts: data,
                  extent: areas,
                  latest: latestData[0].attributes.date
                }
                : {},
            widget
          })
        );
      })
    )
    .catch(error => {
      dispatch(setWidgetData({ widget, error: true }));
      console.info(error);
    });
};

export default {
  getData
};
