import { getExtent, getPlantationsExtent } from 'services/forest-data';
import axios from 'axios';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  axios
    .all([
      getExtent({ ...params, forestType: '' }),
      getPlantationsExtent(params)
    ])
    .then(
      axios.spread((gadmResponse, plantationsResponse) => {
        const gadmExtent = gadmResponse.data && gadmResponse.data.data;
        const plantationsExtent =
          plantationsResponse.data && plantationsResponse.data.data;
        let data = {};
        if (gadmExtent.length && plantationsExtent.length) {
          const totalArea = gadmExtent[0].total_area;
          const totalExtent = gadmExtent[0].value;
          data = {
            totalArea,
            totalExtent,
            plantations: plantationsExtent
          };
        }
        dispatch(setWidgetData({ data, widget }));
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
