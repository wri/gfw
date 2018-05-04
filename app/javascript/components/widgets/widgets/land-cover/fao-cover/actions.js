import axios from 'axios';

import { getFAO } from 'services/forest-data';
import { getRanking } from 'services/country';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  axios
    .all([getFAO({ ...params }), getRanking({ ...params })])
    .then(
      axios.spread((getFAOResponse, getRankingResponse) => {
        let data = {};
        const fao = getFAOResponse.data.rows;
        const ranking = getRankingResponse.data.rows;
        if (fao.length && ranking.length) {
          data = {
            ...fao[0],
            rank: ranking[0].rank || 0
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
