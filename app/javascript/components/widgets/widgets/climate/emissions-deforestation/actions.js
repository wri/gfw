import { getLoss } from 'services/forest-data';
import { fetchAnalysisEndpoint } from 'services/analysis';

export default ({ params }) => {
  if (params.type === 'country') {
    return getLoss(params).then(response => {
      const loss = response.data && response.data.data;
      return loss.length ? { loss } : {};
    });
  }
  return fetchAnalysisEndpoint({
    ...params,
    name: 'Biomass loss',
    params,
    slug: 'biomass-loss',
    version: 'v2'
  }).then(response => {
    const loss =
      response.data.data && response.data.data.attributes.biomassLossByYear;

    return loss
      ? {
        loss: Object.keys(loss).map(l => ({
          year: l,
          emissions: loss[l]
        }))
      }
      : {};
  });
};
