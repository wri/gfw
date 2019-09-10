import { fetchAnalysisEndpoint } from 'services/analysis';

export default ({ params }) =>
  fetchAnalysisEndpoint({
    ...params,
    name: 'Umd',
    params,
    slug: 'umd-loss-gain',
    version: 'v3'
  }).then(
    response =>
      response.data.data &&
      response.data.data.attributes &&
      response.data.data.attributes.years
  );
