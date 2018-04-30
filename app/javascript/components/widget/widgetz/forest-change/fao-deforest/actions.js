import axios from 'axios';

import { getFAODeforest, getFAODeforestRank } from 'services/forest-data';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  axios
    .all([getFAODeforest({ ...params }), getFAODeforestRank({ ...params })])
    .then(
      axios.spread((getFAODeforestResponse, getFAODeforestRankResponse) => {
        const fao = getFAODeforestResponse.data.rows;
        const rank = getFAODeforestRankResponse.data.rows;
        dispatch(
          setWidgetData({
            data: {
              fao,
              rank
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
