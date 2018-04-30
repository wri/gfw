import { getFAOEcoLive } from 'services/forest-data';

export const getData = ({ dispatch, setWidgetData, widget }) => {
  getFAOEcoLive()
    .then(response => {
      dispatch(
        setWidgetData({
          data: response.data.rows,
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
