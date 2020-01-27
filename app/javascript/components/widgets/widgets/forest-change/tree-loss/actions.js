import axios from 'axios';
import { getExtent, getLoss, getLossGrouped } from 'services/forest-data-old';

export default ({ params }) => {
  const { adm0, adm1, adm2, ...rest } = params || {};
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
