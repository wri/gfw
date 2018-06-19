import { getLocations, fetchExtentRanked } from 'services/forest-data';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  (!params.type || params.type === 'global'
    ? fetchExtentRanked(params)
    : getLocations(params)
  )
    .then(response => {
      const { data } = response.data;
      let mappedData = {};
      if (data && data.length) {
        mappedData = data.map(d => ({
          id: d.region,
          extent: d.extent || 0,
          percentage: d.extent ? d.extent / d.total * 100 : 0
        }));
        if (!params.type || params.type === 'global') {
          mappedData = data.map(d => ({
            id: d.iso,
            extent: d.value || 0,
            percentage: d.value ? d.value / d.total_area * 100 : 0
          }));
        }
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
