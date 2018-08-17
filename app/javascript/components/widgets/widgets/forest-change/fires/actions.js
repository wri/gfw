import { fetchViirsAlerts, fetchFiresStats } from 'services/alerts';
import moment from 'moment';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  const dates = [
    moment().format('YYYY-MM-DD'),
    moment()
      .subtract(params.periodValue, params.period)
      .format('YYYY-MM-DD')
  ];
  // Viirs response too heavy at adm0 level, and returns error (CARTO).
  // If country, use alternative service and parse data.
  if (params.country && !params.region && !params.subRegion) {
    fetchFiresStats({ ...params, dates })
      .then(response => {
        const firesResponse = response.data.data.attributes.value;
        const data = firesResponse.filter(v => v.alerts && v.day).map(el => ({
          type: 'viirs-fires',
          attributes: {
            value: el.alerts,
            day: `${el.day}T00:00:00Z`
          }
        }));
        dispatch(
          setWidgetData({
            data,
            widget
          })
        );
      })
      .catch(error => {
        dispatch(setWidgetData({ widget, error: true }));
        console.info(error);
      });
  } else {
    fetchViirsAlerts({ ...params, dates })
      .then(response => {
        dispatch(
          setWidgetData({
            data: response.data.data,
            widget
          })
        );
      })
      .catch(error => {
        dispatch(setWidgetData({ widget, error: true }));
        console.info(error);
      });
  }
};

export default {
  getData
};
