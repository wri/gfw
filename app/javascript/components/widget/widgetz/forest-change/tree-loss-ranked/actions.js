import axios from 'axios';

import { fetchLossRanked, fetchExtentRanked } from 'services/forest-data';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  axios
    .all([fetchLossRanked({ ...params }), fetchExtentRanked({ ...params })])
    .then(
      axios.spread((lossResponse, extentResponse) => {
        const { data } = lossResponse.data;
        let mappedData = [];
        if (data && data.length) {
          mappedData = data.map(item => {
            const loss = item.loss || 0;
            return {
              ...item,
              loss
            };
          });
        }
        dispatch(
          setWidgetData({
            data: {
              loss: mappedData,
              extent: extentResponse.data.data
            },
            widget
          })
        );
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
