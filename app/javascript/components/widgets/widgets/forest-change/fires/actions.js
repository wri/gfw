import { fetchViirsAlerts } from 'services/alerts';
import moment from 'moment';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  const dates = [
    moment().format('YYYY-MM-DD'),
    moment()
      .subtract(params.periodValue, params.period)
      .format('YYYY-MM-DD')
  ];
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
};

export default {
  getData
};
