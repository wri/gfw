import { fetchAnalysisEndpoint } from 'services/analysis';

export default ({ params }) =>
  fetchAnalysisEndpoint({
    ...params,
    name: 'Woody biomass',
    params,
    slug: 'whrc-biomass'
  }).then(response => {
    const attributes =
      response.data && response.data.data && response.data.data.attributes
        ? response.data.data.attributes
        : {};
    const { biomassDensity, totalBiomass } = attributes;

    return { biomassDensity, totalBiomass };
  });
