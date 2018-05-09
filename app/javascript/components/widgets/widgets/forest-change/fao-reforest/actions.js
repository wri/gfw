import { getFAOExtent } from 'services/forest-data';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  getFAOExtent({ ...params })
    .then(response => {
      const data = response.data.rows;
      const hasCountryData = (data.length && data.find(d => d.iso)) || null;
      dispatch(
        setWidgetData({
          data: hasCountryData ? data : {},
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
