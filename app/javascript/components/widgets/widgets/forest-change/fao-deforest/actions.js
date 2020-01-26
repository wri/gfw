import { all, spread } from 'axios';

import { getFAODeforest, getFAODeforestRank } from 'services/forest-data';

export default ({ params }) =>
  all([getFAODeforest(params), getFAODeforestRank(params)]).then(
    spread((getFAODeforestResponse, getFAODeforestRankResponse) => {
      const fao = getFAODeforestResponse.data.rows;
      const rank = getFAODeforestRankResponse.data.rows;
      return {
        fao,
        rank
      };
    })
  );
