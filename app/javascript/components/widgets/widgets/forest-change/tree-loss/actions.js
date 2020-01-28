import { all, spread } from 'axios';
import { getExtent, getLoss, getLossGrouped } from 'services/forest-data-old';

const getGlobalLocation = params => ({
  adm0: params.type === 'global' ? null : params.adm0,
  adm1: params.type === 'global' ? null : params.adm1,
  adm2: params.type === 'global' ? null : params.adm2
});

export const getData = ({ params }) => {
  const { adm0, adm1, adm2, ...rest } = params || {};
  const globalLocation = getGlobalLocation(params);
  const lossFetch =
    params.type === 'global'
      ? getLossGrouped({ ...rest, ...globalLocation })
      : getLoss({ ...rest, ...globalLocation });
  return all([lossFetch, getExtent({ ...rest, ...globalLocation })]).then(
    spread((loss, extent) => {
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

export const getDataURL = params => {
  const globalLocation = getGlobalLocation(params);
  return [
    params.type === 'global'
      ? getLossGrouped({ ...params, ...globalLocation, download: true })
      : getLoss({ ...params, ...globalLocation, download: true }),
    getExtent({ ...params, download: true })
  ];
};

export default getData;
