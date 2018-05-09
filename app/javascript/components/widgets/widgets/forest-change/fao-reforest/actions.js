import { getFAOExtent } from 'services/forest-data';

export const getData = ({ params, dispatch, setWidgetData, widget, state }) => {
  getFAOExtent({ ...params })
    .then(response => {
      const data = response.data.rows;
      const hasCountryData =
        (data.length &&
          data.find(d => d.iso === state().location.payload.country)) ||
        null;
      dispatch(
        setWidgetData({
          data: hasCountryData || params.type === 'global' ? data : {},
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
