import { getLocations } from 'services/forest-data';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  getLocations(params)
    .then(response => {
      const { data } = response.data;
      let mappedData = {};
      if (data && data.length) {
        mappedData = data.map(d => ({
          id: d.region,
          extent: d.extent || 0,
          percentage: d.extent ? d.extent / d.total * 100 : 0
        }));
      }
      dispatch(setWidgetData({ data: mappedData, widget }));
    })
    .catch(error => {
      dispatch(setWidgetData({ widget, error: true }));
      console.info(error);
    });
};

export default {
  getData
};
