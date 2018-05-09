import axios from 'axios';
import sumBy from 'lodash/sumBy';
import omit from 'lodash/omit';

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
          fao.forEach(
            (fao.area_ha = parseFloat(fao.area_ha.replace(',', '')) * 1000)
          );
          let faoData = fao[0];
          if (fao.length > 1) {
            faoData = {};
            Object.keys(omit(fao[0], ['iso', 'name'])).forEach(k => {
              faoData[k] = sumBy(fao, k);
            });
          }
          data = {
            ...faoData,
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
