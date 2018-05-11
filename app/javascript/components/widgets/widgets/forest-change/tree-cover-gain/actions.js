import axios from 'axios';

import { getGainRanked } from 'services/forest-data';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  axios
    .all([getGainRanked(params)])
    .then(
      axios.spread(gainResponse => {
        const gainData = gainResponse.data.data;
        let mappedData = [];
        if (gainData && gainData.length) {
          mappedData = gainData.map(item => {
            const gain = item.gain || 0;
            const extent = item.value || 0;
            return {
              id: item.region,
              gain,
              extent,
              percentage: extent ? 100 * gain / extent : 0
            };
          });
        }
        dispatch(setWidgetData({ data: mappedData, widget }));
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
