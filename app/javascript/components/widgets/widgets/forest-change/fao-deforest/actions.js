import axios from 'axios';

import { getFAODeforest, getFAODeforestRank } from 'services/forest-data';

export default ({ params }) =>
  axios.all([getFAODeforest(params), getFAODeforestRank(params)]).then(
    axios.spread((getFAODeforestResponse, getFAODeforestRankResponse) => {
      const fao = getFAODeforestResponse.data.rows;
      const rank = getFAODeforestRankResponse.data.rows;
      return {
        fao,
        rank
      };
    })
  );
