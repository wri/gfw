import { getLoss } from 'services/forest-data';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  getLoss(params)
    .then(response => {
      const loss = response.data && response.data.data;
      dispatch(setWidgetData({ data: loss.length ? { loss } : {}, widget }));
    })
    .catch(error => {
      dispatch(setWidgetData({ widget, error: true }));
      console.info(error);
    });
};

export default {
  getData
};
