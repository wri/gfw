import { fetchFiresAlerts } from 'services/alerts';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  fetchFiresAlerts(params)
    .then(alerts => {
      const { data } = alerts.data;
      dispatch(setWidgetData({ data: data || {}, widget }));
    })
    .catch(error => {
      dispatch(setWidgetData({ widget, error: true }));
      console.info(error);
    });
};
