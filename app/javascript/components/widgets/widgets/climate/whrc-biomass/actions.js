import axios from 'axios';
import { fetchAnalysisEndpoint } from 'services/analysis';
import { getBiomassRanking } from 'services/climate';

export default ({ params }) =>
  axios
    .all([
      fetchAnalysisEndpoint({
        ...params,
        name: 'Woody biomass',
        params,
        slug: 'whrc-biomass'
      }),
      getBiomassRanking({ ...params })
    ])
    .then(
      axios.spread((analysis, ranking) => {
        const attributes =
          analysis.data && analysis.data.data && analysis.data.data.attributes
            ? analysis.data.data.attributes
            : {};
        const { biomassDensity, totalBiomass } = attributes;

        return {
          biomassDensity,
          totalBiomass,
          ranking: ranking.data && ranking.data.rows
        };
      })
    );
