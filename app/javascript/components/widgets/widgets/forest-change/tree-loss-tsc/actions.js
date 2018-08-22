import axios from 'axios';
import { getExtent, getLoss } from 'services/forest-data';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  axios
    .all([
      getLoss({ ...params, landCategory: 'tsc' }),
      getExtent({ ...params, landCategory: 'tsc' })
    ])
    .then(
      axios.spread((loss, extent) => {
        let data = {};
        if (loss && loss.data && extent && extent.data) {
          data = {
            loss: loss.data.data,
            extent: (loss.data.data && extent.data.data[0].value) || 0
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
