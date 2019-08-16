import axios from 'axios';
import { getExtent, getLoss, getLossGrouped } from 'services/forest-data';
import { fetchAnalysisEndpoint } from 'services/analysis';

export const getDataAPI = ({ params }) =>
  fetchAnalysisEndpoint({
    ...params,
    name: 'umd',
    params,
    slug: 'umd-loss-gain',
    version: 'v1',
    nonAggregate: true
  }).then(response => {
    const { data } = (response && response.data) || {};
    const lossData = data && data.attributes.loss;
    const loss =
      lossData &&
      Object.keys(lossData).map(d => ({
        area: lossData[d],
        year: d
      }));
    const extent = data.attributes.treeExtent;

    return {
      loss,
      extent
    };
  });

export default ({ params }) => {
  const { adm0, adm1, adm2, ...rest } = params || {};

  if (params.type !== 'country' && params.type !== 'global') { return getDataAPI({ params }); }

  const globalLocation = {
    adm0: params.type === 'global' ? null : adm0,
    adm1: params.type === 'global' ? null : adm1,
    adm2: params.type === 'global' ? null : adm2
  };
  const lossFetch =
    params.type === 'global'
      ? getLossGrouped({ ...rest, ...globalLocation })
      : getLoss({ ...rest, ...globalLocation });
  return axios.all([lossFetch, getExtent({ ...rest, ...globalLocation })]).then(
    axios.spread((loss, extent) => {
      let data = {};
      if (loss && loss.data && extent && extent.data) {
        data = {
          loss: loss.data.data,
          extent: (loss.data.data && extent.data.data[0].extent) || 0
        };
      }
      return data;
    })
  );
};
