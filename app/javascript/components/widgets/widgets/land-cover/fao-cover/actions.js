import axios from 'axios';
import sumBy from 'lodash/sumBy';
import omit from 'lodash/omit';

import { getFAO } from 'services/forest-data';
import { getRanking } from 'services/country';

export const getData = ({ params }) =>
  axios.all([getFAO(params), getRanking(params)]).then(
    axios.spread((getFAOResponse, getRankingResponse) => {
      let data = {};
      const fao = getFAOResponse.data.rows;
      const ranking = getRankingResponse.data.rows;
      if (fao.length && ranking.length) {
        const faoTotal = fao.map(f => ({
          ...f,
          area_ha: parseFloat(f.area_ha.replace(',', '')) * 1000
        }));
        let faoData = faoTotal[0];
        if (fao.length > 1) {
          faoData = {};
          Object.keys(omit(faoTotal[0], ['iso', 'name'])).forEach(k => {
            faoData[k] = sumBy(faoTotal, k) || 0;
          });
        }
        data = {
          ...faoData,
          rank: ranking[0].rank || 0
        };
      }
      return data;
    })
  );

export const getDataURL = ({ params }) => [
  getFAO({ ...params, download: true })
];

export default getData;
