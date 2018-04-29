import { fetchGladIntersectionAlerts } from 'services/alerts';
import { getMultiRegionExtent } from 'services/forest-data';
import moment from 'moment';
import axios from 'axios';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  axios
    .all([
      fetchGladIntersectionAlerts({ ...params }),
      getMultiRegionExtent({ ...params })
    ])
    .then(
      axios.spread((alerts, extent) => {
        const { data } = alerts.data;
        const areas = extent.data.data;
        const alertsByDate =
          data &&
          data.filter(d =>
            moment(new Date(d.date)).isAfter(moment.utc().subtract(53, 'weeks'))
          );
        dispatch(
          setWidgetData({
            data:
              alertsByDate && extent
                ? { alerts: alertsByDate, extent: areas }
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
