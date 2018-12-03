import { fetchAnalysisEndpoint } from 'services/analysis';

export default ({ params }) =>
  fetchAnalysisEndpoint({
    ...params,
    name: 'Biomass loss',
    params,
    slug: 'biomass-loss',
    version: 'v2'
  }).then(response => ({
    loss: response.data.data && response.data.data.attributes
  }));
